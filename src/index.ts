import * as dc from "dc";
import * as d3 from "d3";
import * as moment from "moment"
import crossfilter from "crossfilter2";

import { customSearch } from "./custom-search"

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "dc/dist/style/dc.min.css"


const genderChart = dc.pieChart("#gender-chart");
const lifeConditionChart = dc.pieChart("#life-condition-chart");
const statusChart = dc.rowChart("#status-chart")
const yearOfBirthChart = dc.barChart("#year-of-birth-chart");
const searchNameWidget = customSearch("#search-name");
const prisonerTable = dc.dataTable("#prisoner-table");

interface Prisoner {
  "Name": string;
  "Gender": "male" | "female" | "";
  "Place": string;
  "Date of Death": string;
  "Date of Birth": string;
  "Sentence": string;
  "Source": string;
}


type IALL_TRANSLATIONS = {
  [x in "en" | "zh"]: II18N;
};
type I18N_ENTRY = "released" | "unknown" | "sentence" | "prison" | "detention" | "gender" | "male" | "female" | "alive" | "dead" |  "name" | "source" |
                  "place_of_birth" | "date_of_birth" | "date_of_death" | "search_name";
type II18N = {
  [name in I18N_ENTRY]: string;
};

const ALL_TRANSLATIONS: IALL_TRANSLATIONS = {
  "en": {
    "released": "Released",
    "unknown": "Unknown",
    "sentence": "Sentence",
    "prison": "In Prison",
    "detention": "In Detention",
    "gender": "Gender",
    "male": "Male",
    "female": "Female",
    "alive": "Alive",
    "dead": "Dead",
    "name": "Name",
    "source": "Source",
    "place_of_birth": "Place of Birth",
    "date_of_birth": "Date of Birth",
    "date_of_death": "Date of Death",
    "search_name": "Search Name"
  },
  "zh": {
    "released": "出狱",
    "unknown": "未知",
    "sentence": "刑",
    "prison": "监狱",
    "detention": "拘留",
    "gender": "性别",
    "male": "男",
    "female": "女",
    "alive": "活着",
    "dead": "死亡",
    "name": "姓名",
    "source": "来源",
    "place_of_birth": "出生地",
    "date_of_birth": "出生日期",
    "date_of_death": "死亡日期",
    "search_name": "搜索姓名"
  }
}

const path = window.location.pathname;
let i18n: II18N;
if (path.startsWith("/en")) {
  i18n = ALL_TRANSLATIONS.en;
} else if (path.startsWith("/zh")) {
  i18n = ALL_TRANSLATIONS.zh;
} else {
  i18n = ALL_TRANSLATIONS.en; // This line should never be executed.
}

d3.csv("/chinese-political-prisoners.csv").then((data: any) => {
  const prisoners = crossfilter(data as Array<Prisoner>);
  const all = prisoners.groupAll();

  const nameDimension = prisoners.dimension(d => d.Name);
  const genderDimension = prisoners.dimension(d => d.Gender);
  const genderGroup = genderDimension.group();
  const birthYearDimension = prisoners.dimension(d => {
    if (d["Date of Birth"]) {
      return parseInt(d["Date of Birth"].substring(0, 4));
    } else {
      return 0;
    }
  });
  const birthYearGroup = birthYearDimension.group();
  const conditionDimension = prisoners.dimension(d => {
    if (d["Date of Death"]) {
      return true;
    } else {
      return false;
    }
  });
  const conditionGroup = conditionDimension.group();


  const inPrisonDimension = prisoners.dimension(d => {
    if (d["Date of Death"]) {
      return i18n.released;
    }
    let sentence = d["Sentence"];
    if (sentence === "unknown" || sentence === "") { // we assume "unknown" string in the csv to be in the prison
      return i18n.unknown;
    } else if (sentence === "life") {
      return i18n.prison;
    } else if (sentence === "detention") {
      return i18n.detention;
    } else {
      let date = moment(sentence);
      if (sentence.length === 4) { // YYYY -> YYYY-12-31
        date = moment(sentence).endOf("year");
      } else if (sentence.length === 7) { // YYYY-MM -> YYYY-MM-ENDofMONTH
        date = moment(sentence).endOf("month");
      } else if (sentence.length === 10) {
        date = moment(sentence);
      } else {
        console.log(`Invalid sentence field. Name: ${d.Name}, Sentence: ${sentence}`);
      }
      if (moment() < date) {
        return i18n.prison;
      } else {
        return i18n.released;
      }
    }
  })
  const inPrisonGroup = inPrisonDimension.group();


  genderChart
  .width(200)
  .height(200)
  .radius(85)
  .minAngleForLabel(0)
  .dimension(genderDimension)
  .group(genderGroup)
  .label(d => {
    let label;
    if(d.key === "male") {
      label = i18n.male;
    } else if (d.key === "female") {
      label = i18n.female;
    } else {
      label = i18n.unknown;
    }
    if (all.value()) {
      // label += ` - ${d.value} - ${(d.value / (all.value() as number) * 100).toFixed(1)}%`;
      label += ` - ${d.value}`;
    }
    return label;
  })
  .renderLabel(true)
  .transitionDuration(500);


  lifeConditionChart
  .width(200)
  .height(200)
  .radius(85)
  .minAngleForLabel(0)
  .dimension(conditionDimension)
  .group(conditionGroup)
  .label(d => {
    let label;
    if (d.key === true) {
      label = i18n.dead;
    } else {
      label = i18n.alive;
    };
    label += ` - ${d.value}`;
    return label;
  })
  .renderLabel(true)
  .transitionDuration(500);

  statusChart
  .width(220)
  .height(200)
  .dimension(inPrisonDimension)
  .group(inPrisonGroup)
  .label(d => {
    let label;
    label = `${d.key} - ${d.value}`;
    return label;
  })
  .transitionDuration(500)
  .elasticX(true)
  .xAxis().ticks(3);
  // .legend(dc.legend().legendText((d:any) => d.name + ': ' + d.data));

  // https://dc-js.github.io/dc.js/vc/index.html
  // https://dc-js.github.io/dc.js/crime/index.html
  const birthYearGroupAll = birthYearGroup.all();
  const minBirthYear= birthYearGroupAll[1].key as number;
  const maxBirthYear = birthYearGroupAll[birthYearGroupAll.length - 1].key as number;
  yearOfBirthChart
  .width(420)
  .height(200)
  .dimension(birthYearDimension)
  .group(birthYearGroup)
  .x(d3.scaleLinear().domain([minBirthYear, maxBirthYear]));

  searchNameWidget
  .dimension(nameDimension)
  .placeHolder(i18n.search_name as any);

  prisonerTable
  .dimension(birthYearDimension)
  .showSections(false)
  .size(Infinity)
  .order(d3.descending)
  .columns([
    {
      label: i18n.name,
      format: (d:Prisoner) => d.Name
    }, {
      label: i18n.gender,
      format: (d:Prisoner) => {
        if (d["Gender"] === "female") {
          return i18n.female;
        } else if (d["Gender"] === "male"){
          return i18n.male;
        } else {
          return i18n.unknown
        }
      }
    }, {
      label: i18n.date_of_birth,
      format: (d:Prisoner) => {
        if (d["Date of Birth"]) {
          return d["Date of Birth"];
        } else {
          return i18n.unknown;
        }
      }
    }, {
      label: i18n.date_of_death,
      format: (d:Prisoner) => d["Date of Death"]
    }, {
      label: i18n.sentence,
      format: (d:Prisoner) => {
        const sentence = d.Sentence;
        if (sentence === "detention") {
          return i18n.detention;
        } else if (sentence === "unknown") {
          return i18n.unknown;
        } else {
          return d["Sentence"];
        }
      }
    }, {
      label: i18n.place_of_birth,
      format: (d:Prisoner) => d.Place
    }, {
      label: i18n.source,
      format: (d:Prisoner) => {
        let sources = d.Source.split(" ");
        let output = "";
        sources.forEach((s, i)=> {
          output += `<a target="_blank" href=${s}>s${i+1}</a> `
        });
        return output
      }
    }
  ])
  .on('preRender', update_offset)
  .on('preRedraw', update_offset)
  .on('pretransition', display);


  // use odd page size to show the effect better
  var ofs = 0, pag = 15;

  function update_offset() {
      var totFilteredRecs = prisoners.groupAll().value();
      var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
      ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs as number - 1) / pag) * pag : ofs;
      ofs = ofs < 0 ? 0 : ofs;

      prisonerTable.beginSlice(ofs);
      prisonerTable.endSlice(ofs+pag);
  }
  function display() {
      var totFilteredRecs = prisoners.groupAll().value();
      var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
      d3.select('#begin')
          .text(end === 0? ofs : ofs + 1);
      d3.select('#end')
          .text(end as any);
      d3.select('#last')
          .attr('disabled', ofs-pag<0 ? 'true' : null);
      d3.select('#next')
          .attr('disabled', ofs+pag>=totFilteredRecs ? 'true' : null);
      d3.select('#size').text(totFilteredRecs as any);
      if(totFilteredRecs != prisoners.size()){
        d3.select('#totalsize').text("(Total: " + prisoners.size() + " )");
      }else{
        d3.select('#totalsize').text('');
      }
  }
  document.getElementById("last").onclick = () => {
    ofs -= pag;
    update_offset();
    prisonerTable.redraw();
  }
  document.getElementById("next").onclick = () => {
    ofs += pag;
    update_offset();
    prisonerTable.redraw();
  }
  
  dc.renderAll();
  console.log("Render finished");
});

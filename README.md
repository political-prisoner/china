# Chinese Political Prisoner

We maintain a list of Chinese political prisoners and try to visualize the list in a meaningful way.

The list is for all the people who became a political prisoner in China, so it can include foreigners.

## CSV Format

| Name | Gender | Date of Birth | Date of Death | Place | Sentence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| 刘晓波 | male | 1955-12-28 | 2017-07-13 | 长春 | 2019-12-07 | https://cppc1989.blogspot.com/2014/02/blog-post.html |
| Name | male / female | 2000-01-01 / 2000-01 / 2000 / empty | 2000-01-01 / 2000-01 / 2000 / empty | 北京 | 2025-01-01 / 2025-01 / 20205 / detention / unknown | https://source1.com https://source2.com


### Name

The name of the prisoner

### Gender

The gender of the prisoner

### Date of Birth

Date of Birth of the prisoner, if possible, use YYYY-MM-DD, otherwise YYYY-MM, otherwise YYYY, otherwise leave it empty.

### Date of Death

Date of Death of the prisoner, if the prisoner has left our world. YYYY-MM-DD, otherwise YYYY-MM, otherwise YYYY, otherwise leave it empty.

### Place

If the information is available, `Place` is the birth place (in city) of the prisoner. Otherwise it can be the city of the prison, or the city of the prisoner's residence, the most relatable one to the prisoner.

### Sentence

If the sentence information of the prisoner is available, it can be `YYYY-MM-DD`, `YYYY-MM`, `YYYY`. If the prisoner is still in detention, it is `detention`. If the prisoner is in a prison, but the sentence is unknown, it is `unknown`.

### Source

The sources of the row, can be multiple web links separated by space. This also means each URL can't include space inside it, they have to be URL encoded.
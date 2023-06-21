import csv
import requests
from bs4 import BeautifulSoup

with open("groups.csv", "r", encoding='utf-8') as file1:
    reader = csv.reader(file1)
    last = list(reader)[-1][0]

file = open("groups.csv", "a", newline="", encoding='utf-8')
writer = csv.writer(file)

stop = 10000001

for i in range(int(last) + 1, stop):
    # requesting webpage
    page_to_scrape = requests.get("https://steamcommunity.com/gid/" + str(i))
    print(i)

    # parsing html
    soup = BeautifulSoup(page_to_scrape.text, 'html.parser')

    # items on the page
    error = soup.find('div', attrs={"class": "error_ctn"})
    store_page = soup.find('img', attrs={"class": "apphub_StoreAppLogo"})
    community_hub = soup.find('div', attrs={"class": "apphub_HomeHeader"})
    title = soup.find('title').text

    if error or store_page or community_hub or (title == "Access Denied"):
        # no group found
        writer.writerow([i, "N/A", "N/A", "N/A"])
    else:
        name = soup.find('div', attrs={"class": "grouppage_resp_title ellipsis"})
        tag = soup.find('span', attrs={"class": "grouppage_header_abbrev"})
        date = soup.find('div', attrs={'class': 'data'})

        # writing information to file
        writer.writerow([i, name.text.strip().split("\t", 1)[0], tag.text, date.text])

# closing file
file.close()

import requests
from lxml import etree

from app.catalogue.book_models import MarcBookData


class ReadMod:
    NAMESPACE = {"mods": "http://www.loc.gov/mods/v3"}

    def __init__(
        self, mods_xml: str | None = None, mods_url: str | None = None
    ) -> None:
        if mods_xml is not None:
            self._root = etree.fromstring(mods_xml)
        else:
            response = requests.get(mods_url)
            self._root = etree.fromstring(response.content)

        self._origin_info = self._query_xml("//mods:originInfo")[0]

    def get_marcs_data(self) -> MarcBookData:
        return MarcBookData(
            isbn=self._get_isbn(),
            title=self._get_title(),
            place=self._get_place(),
            publisher=self._get_publisher(),
            date_issued=self._get_date_issued(),
            edition=self._get_edition(),
            abstract=self._get_abstract(),
            description=self._get_description(),
            ddc_class=self._get_ddc_class(),
            authors=self._get_authors(),
            topics=self._get_topics(),
        )

    def _get_isbn(self) -> str:
        return self._query_xml("//mods:identifier/text()")[0]

    def _get_title(self) -> str:
        title_info_element = self._query_xml("//mods:titleInfo")[0]

        return self._query_xml("./mods:title/text()", title_info_element)[0]

    def _get_place(self) -> str:
        place_element = self._query_xml(
            "./mods:place/mods:placeTerm[@type='text']/text()", self._origin_info
        )[0]

        return place_element

    def _get_publisher(self) -> str:

        return self._query_xml("./mods:publisher/text()", self._origin_info)[0]

    def _get_date_issued(self) -> str:

        return self._query_xml("./mods:dateIssued/text()", self._origin_info)[0]

    def _get_edition(self) -> str | None:
        edition_element = self._query_xml("./mods:edition/text()", self._origin_info)

        if len(edition_element) == 0:
            return None

        return edition_element[0]

    def _get_abstract(self) -> str | None:
        abstract = self._query_xml("./mods:abstract/text()")

        if len(abstract) == 0:
            return None
        return abstract[0]

    def _get_description(self) -> str:

        return self._query_xml("//mods:physicalDescription/mods:extent/text()")[0]

    def _get_ddc_class(self) -> str:

        return self._query_xml("//mods:classification/text()")[0]

    def _get_authors(self) -> list[str]:
        authors = []

        author_elements = self._query_xml("//mods:name")

        for author_element in author_elements:
            name_parts = self._query_xml("./mods:namePart/text()", author_element)
            author_name = " ".join(name_parts)
            authors.append(author_name)

        return authors

    def _get_topics(self) -> list[str]:
        topics = []

        subject_elements = self._query_xml("//mods:subject")

        for subject_element in subject_elements:
            topic_parts = self._query_xml(
                "./mods:topic/text()", subject_element
            ) or self._query_xml("./mods:geographic/text()", subject_element)

            topics.append(topic_parts[0])

        return topics

    def _query_xml(self, query: str, object: etree._Element | None = None):
        if object is None:
            object = self._root
        return object.xpath(query, namespaces=ReadMod.NAMESPACE)

from pathlib import Path
import pytest

from app.catalogue.book_models import MarcBookData
from app.catalogue.read_mods import ReadMod

BASE_PATH = Path(".") / "tests" / "mod_xmls"
ALFPATH = BASE_PATH / "bib-10878.mods"
INGSOFT = BASE_PATH / "bib-19409.mods"


def test_read_isbn(alf_read_mod):
    assert alf_read_mod._get_isbn() == "9789875662445"


def test_read_title(alf_read_mod):
    assert alf_read_mod._get_title() == "Antología de la literatura fantástica"


def test_read_place(alf_read_mod):
    assert alf_read_mod._get_place() == "Buenos Aires"


def test_read_publisher(alf_read_mod):
    assert alf_read_mod._get_publisher() == "Debolsillo"


def test_read_date_issued(alf_read_mod):
    assert alf_read_mod._get_date_issued() == "2014"


def test_read_edition(alf_read_mod):
    assert alf_read_mod._get_edition() == "9na. ed."


def test_no_abstract(alf_read_mod):
    assert alf_read_mod._get_abstract() is None


def test_xml_with_abstract(ingsoft_read_mod):

    assert ingsoft_read_mod._get_abstract() is not None


def test_assert_read_description(alf_read_mod):

    assert alf_read_mod._get_description() == "407 p. : il."


def test_read_ddc_class(alf_read_mod):

    assert alf_read_mod._get_ddc_class() == "A863 732ant"


def test_multiple_authors(alf_read_mod):
    authors = alf_read_mod._get_authors()

    author_names = []

    for author in authors:
        if author.name == "Borges, Jorge Luis":
            assert author.role == "creator"
        elif author.name in ("Bioy Casares, Adolfo", "Ocampo, Silvina"):
            assert author.role == None

        author_names.append(author.name)

    assert set(author_names) == set(
        ["Borges, Jorge Luis", "Bioy Casares, Adolfo", "Ocampo, Silvina"]
    )


def test_topics(alf_read_mod):
    topics = alf_read_mod._get_topics()

    assert set(topics) == set(
        [
            "ARGENTINA",
            "CUENTOS",
            "LITERATURA",
            "DOCUMENTOS TEORICOS O METODOLOGICOS",
            "LITERATURA ARGENTINA",
        ]
    )


def test_marc_book_data_from_url(alf_read_mod, alf_url):
    from_file_data = alf_read_mod.get_marcs_data()
    from_url_data = ReadMod(mods_url=alf_url).get_marcs_data()

    assert from_file_data == from_url_data


@pytest.fixture
def alf_read_mod():
    """Mods XML data for book: Antología de la literatura fantástica"""
    with open(ALFPATH, "rb") as alf:
        xml_bytes = alf.read()

    return ReadMod(mods_xml=xml_bytes)


@pytest.fixture
def ingsoft_read_mod():
    """Mods XML data for book: Ingeniería de software orientada a ojetivos con UML, Java e Internet"""
    with open(INGSOFT, "rb") as ingsoft:
        xml_bytes = ingsoft.read()

    return ReadMod(mods_xml=xml_bytes)


@pytest.fixture
def alf_url():
    return "http://biblioteca.ungs.edu.ar/cgi-bin/koha/opac-export.pl?op=export&bib=10878&format=mods"

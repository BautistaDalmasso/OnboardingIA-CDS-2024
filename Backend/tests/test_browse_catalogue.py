import pytest

from app.catalogue.browse_catalogue_service import BrowseCatalogueService
from app.file_paths import CATALOGUE_PATH

from tests.test_read_mods import alf_read_mod


def test_browse_by_isbn(bc_service, alf_read_mod):
    read_from_file = alf_read_mod.get_marcs_data()
    result = bc_service.browse_by_isbn("9789875662445")

    compare_with_file(result, read_from_file)


def test_browse_inexistent_isbn(bc_service):
    result = bc_service.browse_by_isbn("9799875662445")

    assert result is None


def test_browse_by_page(bc_service):
    result = bc_service.browse_books_by_page(4, 0)

    assert len(result) == 4


def test_book_with_different_author_roles(bc_service):
    isbn = "9789871450442"

    result = bc_service.browse_by_isbn(isbn)

    author_roles = {
        "Vedda, Miguel": "creator",
        "Burello, Marcelo Gabriel": "int.",
        "Setton, Román": "col.",
    }

    assert_authors_with_roles(result.authors, author_roles)


def test_book_with_single_word_author_name(bc_service):
    isbn = "9789870409229"

    result = bc_service.browse_by_isbn(isbn)

    author_roles = {
        "Saki": "creator",
        "Piñeiro, Claudia": "pról.",
        "Sordi, Fabiana A.": "sel.",
    }

    assert_authors_with_roles(result.authors, author_roles)


def assert_authors_with_roles(authors, author_roles: dict[str, str]):
    author_names = []

    for author in authors:
        author_names.append(author.name)

        assert author.role == author_roles[author.name]

    assert set(author_names) == author_roles.keys()


def compare_with_file(result, read_from_file):
    assert read_from_file.isbn == result.isbn
    assert read_from_file.title == result.title
    assert read_from_file.place == result.place
    assert read_from_file.publisher == result.publisher
    assert read_from_file.date_issued == result.date_issued
    assert read_from_file.edition == result.edition
    assert read_from_file.abstract == result.abstract
    assert read_from_file.description == result.description
    assert read_from_file.ddc_class == result.ddc_class
    assert set([author.name for author in read_from_file.authors]) == set(
        [author.name for author in result.authors]
    )
    assert set(read_from_file.topics) == set(result.topics)


@pytest.fixture
def bc_service():
    return BrowseCatalogueService(CATALOGUE_PATH)

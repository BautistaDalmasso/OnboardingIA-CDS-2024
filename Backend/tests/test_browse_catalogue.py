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
    assert set(read_from_file.authors) == set(result.authors)
    assert set(read_from_file.topics) == set(result.topics)


@pytest.fixture
def bc_service():
    return BrowseCatalogueService(CATALOGUE_PATH)

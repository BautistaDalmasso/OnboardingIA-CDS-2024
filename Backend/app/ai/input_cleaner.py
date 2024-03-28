import nltk

nltk.download("punkt")
nltk.download("wordnet")
nltk.download("omw-1.4")


ACCENT_TRANSLATION = {"á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "¿": ""}
IGNORE = ["?", "!", "¿", ".", ","]


class InputCleaner:
    def __init__(self) -> None:
        self._lemmatizer = nltk.stem.WordNetLemmatizer()

    def cleanup_sentence(self, sentence: str) -> list[str]:
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [
            self.cleanup_word(word) for word in sentence_words if word not in IGNORE
        ]
        return sentence_words

    def cleanup_word(self, word: str) -> str:
        lowercase_word = word.lower()
        lemmatized_word = self._lemmatizer.lemmatize(lowercase_word)
        no_accent_word = ""

        for letter in lemmatized_word:
            if letter in ACCENT_TRANSLATION:
                no_accent_word += ACCENT_TRANSLATION[letter]
            else:
                no_accent_word += letter

        return no_accent_word

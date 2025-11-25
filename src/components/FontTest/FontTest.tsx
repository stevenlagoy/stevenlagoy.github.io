import "./FontTest.module.scss"

export default function FontTest() {
    return (
        <section>
            <h1>Header Text</h1>
            <h2>Subheader Text</h2>
            <h3>This is an H3 element</h3>
            <p>
                Paragraph here. This is a paragraph with a greater amount of text. It is important
                that the paragraph text is readable, even at small scales. Paragraph text is also
                likely to wrap lines and may contain <i>italic text</i> or even <b>bold text</b>.
                Paragraphs may also include numbers like 1, 2, 38530, or -10249534. Could
                punctuation (or other special characters) be included?: it is possible & may even
                be certain!
            </p>
            <h3>Another H3 element</h3>
            <p>Short little paragraph under the second H3 element.</p>
            <h2>Bigger text than the above</h2>
            <p>This paragraph is immediately under the big text.</p>
        </section>
    );
}
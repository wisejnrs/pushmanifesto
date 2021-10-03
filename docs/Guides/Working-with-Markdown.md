# Converting Microsoft Word to Markdown

The following provides example [CLI](https://en.wikipedia.org/wiki/Command-line_interface) using [PanDoc](/Guides/Working-with-Markdown#PanDoc) for converting [Microsoft Word](https://en.wikipedia.org/wiki/Microsoft_Word) documents into [Markdown](https://en.wikipedia.org/wiki/Markdown) with support for [Azure DevOps Style Tables](https://docs.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance?view=azure-devops#tables).  

**Note:** _conversion accuracy depends on styles and complexity of the document, specifically tables may require further treatment_.  If you see HTML Tables then try [HTML-Table-To-Markdown](https://jmalarcon.github.io/markdowntables/)

``` 
pandoc -o output.md -f docx -t markdown-simple_tables-multiline_tables-grid_tables --wrap=none --column=999 "document.docx"
```

# Converting Markdown to Microsoft Word

PanDoc supports a couple of techniques for generating Word documents, as follows:

Firstly, direct:
``` 
pandoc -o output.docx document.md
pandoc --extract-media ..\.media -o output.docx document.md
pandoc --extract-media ..\.media -s --bibliography biblio.json --citeproc --csl ieee.csl CITATIONS -o output.docx document.md
```
... and second is using a Template:
``` 
pandoc --reference-doc djag-template.docx -o output.docx document.md
pandoc --reference-doc djag-template.docx --extract-media ..\.media -s --bibliography biblio.json --citeproc --csl ieee.csl CITATIONS -o output.docx document.md
```

- **Note**: the template only provides Word Styles not content.

Both techniques allow for a _media directory_ (`--extract-media`) to be set for loading images.  Multiple Markdown documents may also be included by appending to the command-line.

Download the following templates [DJAG Template](/.media/templates/djag-template.docx) and [DJAG Template Body](/.media/templates/djag-template-body.docx) to support DJAG styles.

For example:

1. Convert Markdown to Word, ```output.docx```
``` 
pandoc --extract-media ..\.media --reference-doc djag-template.docx -o output.docx document.md
```

2. Open the [DJAG Template Body](/.media/templates/djag-template-body.docx) then paste the resulting contents from the ```output.docx``` and _<u>F</u>ile -> <u>S</u>ave_ to a new document.  Don't forget to update the Document Properties and update the Fields.

# Converting Adobe PDF to Markdown

PanDoc doesn't support directly [PDF](https://en.wikipedia.org/wiki/Adobe_Acrobat) to Markdown. A work-around for this is to convert the PDF to Word using Adobe's online tool: [pdf-to-word](https://www.adobe.com/au/acrobat/online/pdf-to-word.html).  Then use the following:

``` 
pandoc -o output.md -f docx -t markdown-simple_tables-multiline_tables-grid_tables --wrap=none --column=999 "document.docx"
```
# Working with Tables

Finding it hard to keep track using tables?  Then [tablesgenerator](https://www.tablesgenerator.com/) is a good place to get your eye in.  [tablesgenerator](https://www.tablesgenerator.com/) does what it says and for a number of outputs as LaTeX, Html, Text, Markdown and MediaWiki.

# Working with Bibliography


## Specifying a Bibliography

[Pandoc](https://pandoc.org/MANUAL.html#citations) can automatically generate citations and a bibliography in a number of styles. In order to use this feature, you will need to specify a bibliography file using the `bibliography` metadata field in a YAML metadata section. For example:

```yaml
---
title: "Sample Document"
output: pdf_document
bibliography: bibliography.bib
---
```

## Citations

### Citation Syntax

Citations go inside square brackets and are separated by semicolons. Each citation must have a key, composed of ‘@’ + the citation identifier from the database, and may optionally have a prefix, a locator, and a suffix. Here are some examples:

```
Blah blah [see @doe99, pp. 33-35; also @smith04, ch. 1].

Blah blah [@doe99, pp. 33-35, 38-39 and *passim*].

Blah blah [@smith04; @doe99].
```

A minus sign `(-)` before the `@` will suppress mention of the author in the citation. This can be useful when the author is already mentioned in the text:

```
Smith says blah [-@smith04].
```

You can also write an in-text citation, as follows:

```
@smith04 says blah.

@smith04 [p. 33] says blah.
```

## References

- [biblio.json](/.media/templates/biblio.json) - Example Biblography in JSON format.
- [ieee.csl](https://github.com/citation-style-language/styles/blob/master/ieee.csl)

## Software

- [JabRef](https://www.fosshub.com/JabRef.html)
- [zotero](https://www.zotero.org/download) (:heavy_check_mark:)

# Resources
## PanDoc

[Pandoc](https://pandoc.org/) is a [Haskell](https://en.wikipedia.org/wiki/Haskell_(programming_language)) library for converting from one markup format to another, and a command-line tool that uses this library. 

Download via the following link:
- [Download Windows 64-Bit](https://github.com/jgm/pandoc/releases/download/2.14.1/pandoc-2.14.1-windows-x86_64.msi)

### Example Command Line

```
pandoc --extract-media D:\djag-projects\ICTB-Registry-Committals.wiki --reference-doc D:\djag-projects\ICTB-Registry-Committals.wiki\.media\templates\djag-template.docx -o Solution-Design.docx Solution-Design.md
pandoc --extract-media D:\djag-projects\ICTB-Registry-Committals.wiki --reference-doc D:\djag-projects\ICTB-Registry-Committals.wiki\.media\templates\djag-template.docx -o Welcome.docx Welcome.md
```



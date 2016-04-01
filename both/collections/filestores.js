PDFs = new FS.Collection("pdfs", {
    stores: [new FS.Store.FileSystem("pdfs", {path: "./reports"})]
});
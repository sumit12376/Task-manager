const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const filesPath = path.join(__dirname, 'files');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    fs.readdir(filesPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render("index", { files: files });
    });
});

app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.detail, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect("/");
    });
});

app.get('/file/:filename', (req, res) => {
    const filePath = path.join(filesPath, req.params.filename);
    fs.readFile(filePath, "utf-8", (err, filedata) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});
app.get('/edit/:filename', (req, res) => {
    const filename = req.params.filename; // Extract filename from route parameters
    res.render('edit', { file: filename }); // Pass filename to the 'edit' view
});
app.post('/edit', (req, res) => {
    const previousFilename = req.body.previous;
    const newFilename = req.body.new;

    fs.rename(`./files/${previousFilename}`, `./files/${newFilename}`, (err) => {
        if (err) {
            console.error('Error renaming file:', err);
            return res.status(500).send('Error renaming file');
        }
        res.redirect('/');
    });

    console.log(req.body);
});
app.get('/remove/:filename', (req, res) => {
    const filename = req.params.filename;

    fs.unlink(`./files/${filename}`,(err) => { // Provide a callback function to handle the result
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Failed to delete file');
        }
        console.log('File deleted successfully!');
        res.redirect('/')
    });
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

fetch('../footer.html')
.then(response => response.text())
.then(data => {
    // Menyisipkan konten ke dalam elemen
    document.getElementById('content-placeholder').innerHTML = data;

    // Mengekstrak dan mengeksekusi skrip dari konten yang dimuat
    const scripts = document.getElementById('content-placeholder').getElementsByTagName('script');
    for (let script of scripts) {
        eval(script.innerText);
    }
})
.catch(error => console.error('Error:', error));
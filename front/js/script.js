let urlApi = "http://localhost:3000/api/products"; // Lien de l'api

fetch(urlApi) //requete GET sur l'api
    .then( // vérifie si on a bien récupéré les données
        function(resultats) { 
            if (resultats.ok) {
                resultats.json().then( //convertion données json en javascript
                    function(donnees) {
                        let article =``;
                        for (let kanap of donnees) { //pour chaque objet dans données, on rempli le HTML
                            article +=`<a href="./product.html?id=${kanap._id}">`;
                            article +=`<article>`;
                            article +=`<img src="${kanap.imageUrl}" alt="${kanap.altTxt}">`;
                            article +=`<h3 class="productName">${kanap.name}</h3>`;
                            article +=`<p class="productDescription">${kanap.description}</p>`;
                            article +=`</article>`;
                            article +=`</a>`;
                        }
                        document.querySelector("#items").innerHTML = article; //on insert les articles dans le HTML
                    }
                );
            }
        }
    )
    .catch( // si il n'a pas réussi a faire le then
        function(err) {
            let article = `<p>Les articles n'ont pas pu se charger, verifiez que le serveur local est bien lancé</p>`;
            document.querySelector("#items").innerHTML = article;
        }
    )
; 

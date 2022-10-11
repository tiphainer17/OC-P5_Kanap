//Récupération des paramètres
let params = new URL(document.location).searchParams;
let id = params.get("id");

//Requete sur l'id de l'URL
let urlApi = "http://localhost:3000/api/products/"+id;

fetch(urlApi) //requete GET sur l'api
    .then( // vérifie si on a bien récupérer les données
        function(resultat) { 
            if (resultat.ok) {
                resultat.json().then( //convertion données json en javascript
                    function(kanap) {
                        document.title=`${kanap.name}`;
                        document.querySelector(".item__img").innerHTML = `<img src="${kanap.imageUrl}" alt="${kanap.altTxt}"> `;
                        document.querySelector("#title").textContent = `${kanap.name}`;
                        document.querySelector("#price").textContent = `${kanap.price}`;
                        document.querySelector("#description").textContent = `${kanap.description}`;

                        let options = ``
                        for(let color of kanap.colors){ //parcours des couleurs du kanap
                            options = `<option value="${color}">${color}</option>`;
                            document.querySelector("#colors").insertAdjacentHTML("beforeend",options);
                        }
                    }
                );
            }
        }
    )
    .catch( // si il n'a pas réussi a faire le then, on retourne à la page d'accueil
        function(err) {
            window.location.href ="index.html";
        }
    )
; 
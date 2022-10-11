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
                        /****************************************/
                        /*  AFFICHAGE DES DONNEES SUR LA PAGE   */
                        /****************************************/
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

                        /****************************************/
                        /*     AJOUT ARTICLE DANS LE PANIER     */
                        /****************************************/
                        document.querySelector("#addToCart").addEventListener("click",function(event){ //au clic sur le bouton
                            event.preventDefault(); //suppression comportement par defaut
                            if(// si les champs sont bien rempli
                                document.querySelector("#quantity").reportValidity() &&
                                document.querySelector("#colors").reportValidity()
                            ){  
                                            let produitToAdd = {
                                                id :kanap._id,
                                                quantite : parseInt(document.querySelector("#quantity").value),
                                                color : document.querySelector("#colors").value,
                                            }; //on creer un objet avec les valeurs saisies
                                            
                                            let panier = JSON.parse(localStorage.getItem("panier")); 

                                            if (panier){ //si panier existe
                                                for(let list of panier){ //pour chaque element du panier on verifie, 
                                                    if(produitToAdd._id == list.id && produitToAdd.color== list.color) {//si l'objet est deja present
                                                        let produitToAddDouble={
                                                            id : list.id,
                                                            quantite : list.quantite = list.quantite+produitToAdd.quantite,
                                                            color : list.color,
                                                        }; //on cumule les quantités

                                                        let index = panier.indexOf(list); //on recupere sa position dans l'array
                                                        panier.splice(index,1); //on le supprime

                                                        //on le remplace par la combinaison des quantités
                                                        panier.push(produitToAddDouble);
                                                        localStorage.setItem("panier",JSON.stringify(panier));

                                                    }
                                                    else { //sinon on ajoute notre nouvel objet
                                                        panier.push(produitToAdd)
                                                        localStorage.setItem("panier",JSON.stringify(panier));
                                                    }
                                                }
                                            }
                                            else { //sinon on le créer avant d'ajouter au panier
                                                panier = [];
                                                panier.push(produitToAdd);
                                                localStorage.setItem('panier',JSON.stringify(panier));
                                            }

                            } else { //sinon demande de les remplir
                                            alert("Veuillez remplir les informations de couleur et quantité");
                            }
                        });

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
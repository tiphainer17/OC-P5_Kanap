/****************************************/
/*     RECUPERATION DES PARAMETRES      */
/****************************************/
let params = new URL(document.location).searchParams; //cherche les parametre dans l'url
let id = params.get("id"); //cible le parametre id
let urlApi = "http://localhost:3000/api/products/"+id; //lien de l'api par id

/****************************************/
/*  AFFICHAGE DES DONNEES SUR LA PAGE   */
/****************************************/
function affichageKanap(kanap){
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

/****************************************/
/*     AJOUT ARTICLE DANS LE PANIER     */
/****************************************/
function ajoutAuPanier(kanap){
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
                        if (panier !==null){ //si panier existe
                            let bool=false; //n'a pas trouv?? d'article similaire 
                            for(let list of panier){ //pour chaque element du panier on verifie, 
                                if(produitToAdd.id == list.id && produitToAdd.color == list.color) {//si l'objet est deja present
                                    let quantiteTotal = list.quantite + produitToAdd.quantite;
                                    let produitToAddDouble={
                                        id : list.id,
                                        quantite : quantiteTotal,
                                        color : list.color,
                                    }; //on cumule les quantit??s

                                    index = panier.indexOf(list); //on recupere sa position dans l'array
                                    panier.splice(index,1); //on le supprime

                                    //on le remplace par la combinaison des quantit??s
                                    panier.push(produitToAddDouble);
                                    localStorage.setItem("panier",JSON.stringify(panier));
                                    bool=true; //a trouv?? un article similaire
                                    break; // on quitte la boucle une fois article similaire trouv?? pour pas repasser dessus son reajout
                                }
                            }
                            if(!bool) { //si toute la boucle a ??t?? parcourru sans trouver d'article similaire, on ajoute
                                panier.push(produitToAdd);
                                localStorage.setItem("panier",JSON.stringify(panier));
                            }
                        }
                        else { //sinon on le cr??er avant d'ajouter au panier
                            panier=[];
                            panier.push(produitToAdd);
                            localStorage.setItem('panier',JSON.stringify(panier));
                        }
        } else { //sinon demande de les remplir
                        alert("Veuillez remplir les informations de couleur et quantit??");
        }
        alert("Produit ajout?? au panier!")
    });

}

/****************************************/
/*       EXECUTION DE LA REQUETE        */
/****************************************/
fetch(urlApi) //requete GET sur l'api
    .then( // v??rifie si on a bien r??cup??rer les donn??es
        function(resultat) { 
            if (resultat.ok) {
                resultat.json().then( //convertion donn??es json en javascript
                    function(kanap) {
                        affichageKanap(kanap); // appel de la fonction traitant l'affichage
                        ajoutAuPanier(kanap); // appel de la fonction traitant l'ajout au panier
                    }
                );
            }
        }
    )
    .catch( // si il n'a pas r??ussi a faire le then, on retourne ?? la page d'accueil
        function(err) {
            window.location.href ="index.html";
        }
    )
; 

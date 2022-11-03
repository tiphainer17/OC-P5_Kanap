/****************************************/
/*   INITIALISATION VARIABLES UTILE     */
/****************************************/
let urlApi="http://localhost:3000/api/products/"//url standard de l'api
let panier = JSON.parse(localStorage.getItem("panier")); //on recupere le contenu du localstorage
let quantiteTotal =0;
let prixTotal = 0;
let article =``;

/****************************************/
/*           MAIN DE LA PAGE            */
/****************************************/
if (panier !==null && panier.length != 0){ //si le contenu du panier n'est pas vide
    for(let list of panier){ // on parcours tout le localstorage
        let urlApiId= urlApi+list.id;//on ajoute a l'url standard le numero de l'id du kanap parcouru actuellement
        fetch(urlApiId) //on requete
            .then(
                function(resultat){
                    if(resultat.ok){
                        resultat.json().then(
                            function(kanap){
                                affichagePanier(list,kanap);//on affiche les valeurs du kanap actuel
                                demandeModification();//au changement de quantité
                                demandeSuppression();//au clic sur supprimé
                            }
                        )
                    }
                }
            )
            .catch(
                function(err){
                    alert("Veuillez vérifier votre connexion au service web")
                }
            )
        ;

    }
    formulaire(); //on traite le formulaire
    
}
else {
    //indiquer que le panier est vide
    document.querySelector("#cart__items").innerHTML=`<p>Aucun produit ajouté au panier</p>`;
    document.querySelector("#totalQuantity").textContent = `${quantiteTotal}`;
    document.querySelector("#totalPrice").textContent=`${prixTotal}`;

    //
    let boutonCommander = document.querySelector("#order");
    boutonCommander.addEventListener("click", function(event){
        event.preventDefault();
        alert("Vous ne pouvez pas commander, le panier est vide");
    });
                            
}

/****************************************/
/*  AFFICHAGE DES DONNEES SUR LA PAGE   */
/****************************************/
function affichagePanier(list,kanap){
    article+=`<article class="cart__item" data-id="${list.id}" data-color="${list.color}">`;
    article+=`<div class="cart__item__img">`;
    article+=`<img src="${kanap.imageUrl}" alt="${kanap.altTxt}">`;
    article+=`</div>`;
    article+=`<div class="cart__item__content">`;
    article+=`<div class="cart__item__content__description">`;
    article+=`<h2>${kanap.name}</h2>`;
    article+=`<p>${list.color}</p>`;
    article+=`<p>${list.quantite*kanap.price} €</p>`;
    article+=`</div>`;
    article+=`<div class="cart__item__content__settings">`;
    article+=`<div class="cart__item__content__settings__quantity">`;
    article+=`<p>Qté : </p>`;
    article+=`<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${list.quantite}">`;
    article+=`</div>`;
    article+=`<div class="cart__item__content__settings__delete">`;
    article+=`<p class="deleteItem">Supprimer</p>`;
    article+=`</div>`;
    article+=`</div>`;
    article+=`</div>`;
    article+=`</article>`;
    document.querySelector("#cart__items").innerHTML=article;//on ajoute le contenu html du kanap actuel

    //on met a jour le total du panier
    quantiteTotal += list.quantite;
    prixTotal += list.quantite*kanap.price;
    document.querySelector("#totalQuantity").textContent = `${quantiteTotal}`;
    document.querySelector("#totalPrice").textContent=`${prixTotal}`;  
}


/****************************************/
/*       SUPPRESSION D'UN ARTICLE       */
/****************************************/
function demandeSuppression(){
    let boutonSupprime = document.querySelectorAll(".deleteItem"); //on selectionne tout les p Supprimer
    for (let i = 0; i < boutonSupprime.length; i++){ //on parcourt tout les p supprimer
        boutonSupprime[i].addEventListener("click",function(event) { // au clic sur le i ieme supprimer
            event.preventDefault();
            //on recupere l'id et la color du i ieme element
            let idDelete = panier[i].id;
            let colorDelete = panier[i].color;
            panier = panier.filter( el => el.id !== idDelete || el.color !== colorDelete );//on filtre le contenu du localstorage panier pour eliminer celui ciblé
            localStorage.setItem("panier", JSON.stringify(panier));//on actualise le panier
            window.location.reload();//on refresh la page
        });
    }
}

/****************************************/
/*     MODIFICATION D'UNE QUANTITE      */
/****************************************/
function demandeModification(){
    let quantiteHTML = document.querySelectorAll(".itemQuantity"); //on recupere tout les elements de quantite
    for (let i = 0; i < quantiteHTML.length; i++){ // pour chaque element quantite
        quantiteHTML[i].addEventListener("change" , function(event) { //on attend un changement
            event.preventDefault();
            //on recupere la quantité du panier et la nouvelle quantité
            let quantityModif = panier[i].quantite;
            let qttModifValue = quantiteHTML[i].valueAsNumber;
            const resultFind = panier.find((el) => el.qttModifValue !== quantityModif);//cherche dans le panier la premiere quantite nouvelle pas egal a l'ancienne
            resultFind.quantite = qttModifValue; //l'element trouvé se voit attribuer la nouvelle quantite
            panier[i].quantite = resultFind.quantite; //on remplace la valeur dans le panier
            localStorage.setItem("panier", JSON.stringify(panier)); //on actualise le panier
            window.location.reload();//on refresh la page
        });
    }
}

/****************************************/
/*       TRAITEMENT DU FORMULAIRE       */
/****************************************/
//recuperer les données
//creer un objet contact contenant les info + panier

function formulaire(){
    //vérification des types de données entrée
    let vert = "#def8d7"; //couleur champ valide
    let rouge = "#f8d7d7"; //couleur champ invalide
    let form = document.querySelector(".cart__order__form"); //on selectionne le formulaire
    //on attend un evenement sur prenom
    form.firstName.addEventListener("change", function(event){
        event.preventDefault;
        if (isValidText(this.value)){
            event.target.style.backgroundColor = vert;
        } else {
            event.target.style.backgroundColor = rouge;
        }
    });
    //on attend un evenement sur nom
    form.lastName.addEventListener("change", function(event){
        event.preventDefault;
        if (isValidText(this.value)){
            event.target.style.backgroundColor = vert;
        } else {
            event.target.style.backgroundColor = rouge;
        }
    });
    //on attend un evenement sur adresse
    form.address.addEventListener("change", function(event){
        event.preventDefault;
        if (isValidAddress(this.value)){
            event.target.style.backgroundColor = vert;
        } else {
            event.target.style.backgroundColor = rouge;
        }
    });
    //on attend un evenement sur ville
    form.city.addEventListener("change", function(event){
        event.preventDefault;
        if (isValidCity(this.value)){
            event.target.style.backgroundColor = vert;
        } else {
            event.target.style.backgroundColor = rouge;
        }
    });
    //on attend un evenement sur email
    form.email.addEventListener("change", function(event){
        event.preventDefault;
        if (isValidEmail(this.value)){
            event.target.style.backgroundColor = vert;
        } else {
            event.target.style.backgroundColor = rouge;
        }
    });

    //envoie du formulaire
    let boutonCommander = document.querySelector("#order"); //selection du bouton commande
    boutonCommander.addEventListener("click", function(event){ //au click sur le bouton commande
        event.preventDefault();
        if( isValidText(form.firstName.value)
            && isValidText(form.lastName.value)
            && isValidAddress(form.address.value)
            && isValidCity(form.city.value)
            && isValidEmail(form.email.value)){ //si tout les champs du formulaire respectent les conditions
                    let panierValider = []; // contenu de la commande
                    for (let produit of panier){ //on ajoute un a un a la commande le contenu du localstorage
                        panierValider.push(produit);
                    }
                    let contact = { 
                        infoClient : {
                            firstName : form.firstName.value,
                            lastName : form.lastName.value,
                            address : form.address.value,
                            city : form.city.value,
                            email : form.email.value
                        },
                        commande : panierValider
                    } // on créé un objet contenant le contenu du formulaire + la commande
                    console.log(contact);
            }
    });
}
 
//Tests de validité avec Regex
 function isValidText(aTest){ //Prenom/Nom
    return /^[A-Za-zèéàêë]{2,20}$/.test(aTest);
}
function isValidAddress(aTest){ //Adresse
    return /^([0-9]*) ([a-zA-Z-èéàêë ]*)$/.test(aTest);
}
function isValidCity(aTest){ //Ville
    return /^([a-zA-Z-èéàêë ]*)$/.test(aTest);
}
function isValidEmail(aTest){ // Email
    return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(aTest);
}
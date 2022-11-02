/****************************************/
/*   INITIALISATION VARIABLES UTILE     */
/****************************************/
let urlApi="http://localhost:3000/api/products/"//url standard de l'api
let panier = JSON.parse(localStorage.getItem("panier")); //on recupere le contenu du localstorage
let quantiteTotal =0;
let prixTotal = 0;
let article =``;

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
/*     MODIFICATION D'UNE QUANTITE      */
/****************************************/
function demandeModification(){
    //event quand on quitte la case
    //recup info class itemQuantity
    //modif dans localstorage
    //(chercher .find)
    //window.location.reload();
    const cart = document.querySelectorAll(".cart__item");
    /* manière de regarder ce que l'on a d'affiché dynamiquement grace au dataset
     cart.forEach((cart) => {console.log("item panier en dataset: " + " " + cart.dataset.id + " " + cart.dataset.couleur + " " + cart.dataset.quantité); }); */
    // On écoute ce qu'il se passe dans itemQuantity de l'article concerné
    cart.forEach((cart) => {
     cart.addEventListener("change", (eq) => {
      // vérification d'information de la valeur du clic et son positionnement dans les articles
      let panier = JSON.parse(localStorage.getItem("panier"));
      // boucle pour modifier la quantité du produit du panier grace à la nouvelle valeur
      for (article of panier)
        if (
          article.id === cart.dataset.id &&
          cart.dataset.color === article.color
        ) {
          article.quantité = eq.target.value;
          localStorage.panier = JSON.stringify(panier);
          // on met à jour le dataset quantité
          cart.dataset.quantité = eq.target.value;
          // on joue la fonction pour actualiser les données
          //totalProduit();
        }
    });
  });
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
                                demandeModification();//au clic sur modifier
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
    
}
else {
    document.querySelector("#cart__items").innerHTML=`<p>Aucun produit ajouté au panier</p>`;
    document.querySelector("#totalQuantity").textContent = `${quantiteTotal}`;
    document.querySelector("#totalPrice").textContent=`${prixTotal}`;
                            
}
console.log(panier);

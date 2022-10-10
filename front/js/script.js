let urlApi = "http://localhost:3000/api/products";

let truc =fetch(urlApi)
    .then(function(resultats) {
        if (resultats.ok) {
            resultats.json().then(function(donnees) {
                let article =``;
                for (let kanap of donnees) {
                    article +=`<a href="./product.html.id=${kanap._id}">`;
                    article +=`<article>`;
                    article +=`<img src="${kanap.imageUrl}" alt="${kanap.altTxt}">`;
                    article +=`<h3 class="productName">${kanap.name}</h3>`;
                    article +=`<p class="productDescription">${kanap.description}</p>`;
                    article +=`</article>`;
                    article +=`</a>`;
                }
                document.querySelector("#items").innerHTML = article;
            });
        }
    })
    .catch(function(err) {
        // Une erreur est survenue
    })
; 
//<a href="./product.html?id=42">
//          <article>
//           <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
//         <h3 class="productName">Kanap name1</h3>
//         <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
//       </article>
//     </a> -->
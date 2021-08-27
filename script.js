$(document).ready(function () {
    getCards()
});
const conditions = ["Mint", "Near Mint", "Excellent", "Good", "Light Player", "Played", "Poor"]
const cards = document.querySelector("#card");
const sellers = document.querySelector("#sellers");

const spin = $("#loading");
const timer = document.querySelector("#timer");

function updateTimer(timestamp) {
    timer.innerHTML = "<strong>Dernière mise à jour :</strong> "
    let seconds = Math.floor((new Date().getTime() / 1000) - timestamp)

    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)

    if (hours > 0)
        if (hours > 24)
            timer.innerHTML += days + " jour" + (days === 1 ? "" : "s")
        else
            timer.innerHTML += hours + " heure" + (hours === 1 ? "" : "s")
    else if (minutes > 0)
        timer.innerHTML += minutes + " minute" + (minutes === 1 ? "" : "s")
    else
        timer.innerHTML += seconds + " seconde" + (seconds === 1 ? "" : "s")
}


function getCards() {
    let t = $("#cards_list");
    t.empty()

    spin.show();
    let test = document.getElementById("cards_list");
    $.getJSON("data.json").then(function (data) {

        updateTimer(data.timestamp)

        spin.hide();

        $.each(data.cards, function (key, val) {
            let clone = document.importNode(cards.content, true);
            clone.id = val.name
            clone.querySelector("#cardName").innerHTML = val.name;
            clone.querySelector("#picture").src = val.link
            clone.querySelector("#link").href = val.MyCard.link

            clone.querySelector("#price").innerHTML = "<strong>Votre prix :</strong> <span class=\"badge bg-success\">" + val.MyCard.price + "€ </span>"
            clone.querySelector("#lang").innerHTML = "<strong>Langue :</strong> " + val.MyCard.language
            clone.querySelector("#firstEdition").innerHTML = val.MyCard.first_edition ? " <strong>Est une première édition</strong>" : "<strong>N'est pas une première édition</strong>"
            clone.querySelector("#condition").innerHTML = "<strong>Condition :</strong> " + conditions[val.MyCard.condition]
            clone.querySelector("#nbOffers").innerHTML = "<strong>Nombre d'offres similaires :</strong> " + val.offers.length


            if (val.offers.length === 0)
                clone.querySelector("h5").textContent = "Pas d'autres offres similaires"

            $.each(val.offers, function (int, offer) {
                let accordion = document.importNode(sellers.content, true);

                let timestamp = new Date().getTime()
                accordion.querySelector("h2").id = offer.seller + key

                let acc = accordion.querySelector("#NameSeller")
                acc.setAttribute("data-bs-target", "#" + offer.seller + key)
                acc.setAttribute("aria-controls", offer.seller + key)

                let body = accordion.querySelector("#collapseTwo");
                body.id = offer.seller + key
                body.setAttribute("data-bs-parent", "offers")
                body.setAttribute("aria-labelledby", offer.seller + key)

                accordion.querySelector("#NameSeller").innerHTML = offer.seller
                accordion.querySelector("#priceSeller").innerHTML = "<strong>Son prix :</strong> <span class=\"badge bg-success\">" + offer.price + "€ </span>"
                accordion.querySelector("#langSeller").innerHTML = "<strong>Langue :</strong> " + offer.language
                accordion.querySelector("#firstEditionSeller").innerHTML = offer.first_edition ? " <strong>Est une première édition</strong>" : "<strong>N'est pas une première édition</strong>"
                accordion.querySelector("#conditionSeller").innerHTML = "<strong>Condition :</strong> " + conditions[offer.condition]

                clone.querySelector("#offers").appendChild(accordion);
            })

            test.appendChild(clone);

        });

    });
}

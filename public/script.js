// DATA MODEL
// {
//     "title": "oracle 0",
//     "oracle": {
//         "left": ["lorc", "cat"],
//         "right": ["faithtoken", "dragon-head"]
//     }
// },

// SOURCE_JSON https://game-icons.net/sitemaps/icons.json

let ICONS_TUPLES = null;
let SAVED_ORACLES = []
let LEFT_ORACLE = null;
let RIGHT_ORACLE = null;

const hamburger = document.getElementById("hamburger");
const sider = document.getElementById("sider");
const container = document.getElementById("container");

const oracle_btn = document.getElementById("oracle-button");
const save_btn = document.getElementById("save-button");


function refresh_saved_oracles() {
    sider.innerHTML = "";
    SAVED_ORACLES.forEach(oracle => {
        const new_li = document.createElement("LI");
        const new_link = document.createElement("A");
        new_link.innerText = oracle.title;
        new_link.setAttribute("href", "#" + oracle.title);
        new_link.addEventListener("click", e => {
            document.getElementById("oracle").innerHTML = "";
            oracle.oracle.forEach(addr => display_icon(addr));
        })
        new_li.appendChild(new_link);
        sider.appendChild(new_li);
    });
}

async function fetch_and_flatten_icons_table() {
    const json_document = await fetch("/game_icons").then(e => e.json())
    console.log(json_document);
    let icons_tuples_tmp = [];
    const icons = json_document["icons"]["1x1"];
    for (let author_number in Object.keys(icons)) {
        const author = Object.keys(icons)[author_number];
        for (const title_number in icons[author]) {
            const title = icons[author][title_number];
            icons_tuples_tmp.push([author, title]);
        }
    }
    return icons_tuples_tmp;
}

async function generate_random_icon(tuples) {
    const icon_tuples = await tuples;
    const random_icon_number = Math.floor(Math.random() * icon_tuples.length);
    const author = icon_tuples[random_icon_number][0];
    const title = icon_tuples[random_icon_number][1];
    return generate_address(author, title);
}

function generate_address(author, title) {
    return "https://game-icons.net/icons/ffffff/000000/1x1/" + author + "/" + title + ".png";
}

async function display_icon(random_icon_png_addr) {
    const icon_image = document.createElement("IMG");
    icon_image.setAttribute("src", await random_icon_png_addr);
    icon_image.setAttribute("width", "512px");
    icon_image.classList.add("icon");
    icon_image.addEventListener("click", e => {
        if (!ICONS_TUPLES) {
            ICONS_TUPLES = fetch_and_flatten_icons_table();
        }
        const random_icon_png_addr = generate_random_icon(ICONS_TUPLES);
        change_icon(random_icon_png_addr, e.target);
    }
    );
    document.getElementById("oracle").appendChild(icon_image);
}

async function change_icon(random_icon_png_addr, target) {
    target.setAttribute("src", await random_icon_png_addr);
}

//////////////////
// Main Program //
//////////////////

refresh_saved_oracles();

hamburger.addEventListener("click", e => {
    sider.classList.toggle("active");
})

container.addEventListener("click", e => {
    sider.classList.remove("active");
})

Array.from(container.children).forEach(child => child.addEventListener("click", e => {
    e.stopPropagation();
}));

save_btn.addEventListener("click", e => {
    SAVED_ORACLES.push({
        "title": "oracle_" + SAVED_ORACLES.length,
        "oracle": Array.from(document.getElementById("oracle").children).reduce(
            (acc, img) => {
                acc.push(img.getAttribute("src"));
                return acc;
            },
            []
        )
    })
    refresh_saved_oracles();
});

oracle_btn.addEventListener("click", e => {
    document.getElementById("oracle").classList.remove("hidden");
    document.getElementById("save-button").classList.remove("hidden");

    if (!ICONS_TUPLES) {
        ICONS_TUPLES = fetch_and_flatten_icons_table();
    }
    document.getElementById("oracle").innerHTML = "";

    const random_icon_png_addr_0 = generate_random_icon(ICONS_TUPLES);
    const random_icon_png_addr_1 = generate_random_icon(ICONS_TUPLES);

    display_icon(random_icon_png_addr_0);
    display_icon(random_icon_png_addr_1);
});
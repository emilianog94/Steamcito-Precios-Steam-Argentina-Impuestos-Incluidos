// async function fetchData() {
//     try {
//         const response = await fetch("https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=es-ES&country=AR&allowCountries=AR", {
//             method: "GET",
//             headers: {
//             }
//         });

//         if (!response.ok) throw new Error("Error en la API");

//         const data = await response.json();
//         console.log("Datos recibidos:", data);
//     } catch (error) {
//         console.error("Error al obtener datos:", error);
//     }
// }


// fetchData();
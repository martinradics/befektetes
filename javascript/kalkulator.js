const inflaciok = [28.9, 35.0, 23.0, 22.5, 18.8, 28.2, 23.6, 18.3,
14.3, 10.0, 9.8, 9.2, 5.3, 4.7, 6.8, 3.6, 3.9, 8.0, 6.1, 4.2, 4.9,
3.9, 5.7, 1.7, -0.2, -0.1, 0.4, 2.4, 2.8, 3.4, 3.3, 5.1, 14.5,
17.6, 3.7];

function hozamSzamitas(kezdoToke, kamatBemenet, evek, haviPlussz) {
	const evesKamat = kamatBemenet / 100;
	const haviKamat = evesKamat / 12;
	const honapok = evek * 12;
	
	const jovoToke = kezdoToke * Math.pow(1 + evesKamat, evek);
	
	let jovoBefizetes = 0;
	if (haviPlussz > 0) {
		jovoBefizetes = haviPlussz * ((Math.pow(1 + haviKamat, honapok) - 1) / haviKamat);
	}
	const osszesEredmeny = Math.floor(jovoToke + jovoBefizetes);
	const osszesBefizetes = kezdoToke + haviPlussz * honapok;
	
	return [Math.round(osszesEredmeny), Math.round(osszesBefizetes)];
}

function inflacioSzamitas(elsoEvInput, utolsoEvInput) {
	const indexElso = elsoEvInput - 1990;
	const indexUtolso = utolsoEvInput - 1990;
	let vegeredmeny = 1;
	
	for (let i = indexElso; i <= indexUtolso; i++) {
		vegeredmeny = vegeredmeny * (1 + (inflaciok[i]/100));
	}
	let atlag = Math.pow(vegeredmeny, 1/(utolsoEvInput - elsoEvInput + 1));
	vegeredmeny--;
	atlag--;
	
	return [Math.round(vegeredmeny*10000)/100, Math.round(atlag*10000)/100];
}

const hozamForm = document.getElementById("hozamjs");
const inflacioForm = document.getElementById("inflaciojs");


hozamForm.addEventListener("submit", function(eventHozam) {
	eventHozam.preventDefault();
	
	const hozamEredmenyBox = document.getElementById("eredmeny-hozam");
	
	const hozamTokeInput = document.getElementById("hozam-toke");
	const hozamKamatInput = document.getElementById("hozam-kamat");
	const hozamEvInput = document.getElementById("hozam-ev");
	const hozamHaviInput = document.getElementById("hozam-havi");
	const hozamAdoInput = document.getElementById("hozam-ado");
	
	let isValidHozam = true;
	
	if (hozamEredmenyBox) {
		hozamEredmenyBox.innerHTML = "";
	}
	if (hozamTokeInput.classList.contains("errorclass")) {
		hozamTokeInput.classList.remove("errorclass");
	}
	if (hozamKamatInput.classList.contains("errorclass")) {
		hozamKamatInput.classList.remove("errorclass");
	}
	if (hozamEvInput.classList.contains("errorclass")) {
		hozamEvInput.classList.remove("errorclass");
	}
	if (hozamHaviInput.classList.contains("errorclass")) {
		hozamHaviInput.classList.remove("errorclass");
	}
	
	if (hozamKamatInput.value === "") {
		const hiba = document.createElement("p");
		hiba.textContent = "Az éves kamat megadása kötelező!";
		hozamKamatInput.classList.add("errorclass");
		hozamEredmenyBox.appendChild(hiba);
		isValidHozam = false;
	}
	
	if (hozamEvInput.value === "") {
		const hiba = document.createElement("p");
		hiba.textContent = "Az időtartam megadása kötelező!";
		hozamEvInput.classList.add("errorclass");
		hozamEredmenyBox.appendChild(hiba);
		isValidHozam = false;
	}
	
	if (Number(hozamTokeInput.value) === 0 && Number(hozamHaviInput.value) === 0) {
		const hiba = document.createElement("p");
		hiba.textContent = "A kezdőtőke vagy a havi befizetés megadása kötelező!";
		hozamTokeInput.classList.add("errorclass");
		hozamHaviInput.classList.add("errorclass");
		hozamEredmenyBox.appendChild(hiba);
		isValidHozam = false;
	}
	
	if (isValidHozam) {
		const vegeredmenyHozamP = document.createElement("p");
		
		let hozamTokeVariable = Number(hozamTokeInput.value);
		let hozamKamatVariable = Number(hozamKamatInput.value);
		let hozamEvVariable = Number(hozamEvInput.value);
		let hozamHaviVariable = Number(hozamHaviInput.value);
		let hozamAdoVariable = Number(hozamAdoInput.value)
		
		const eredmenyHozamSzamitott = hozamSzamitas(hozamTokeVariable, hozamKamatVariable, hozamEvVariable, hozamHaviVariable);
		const tisztaNyereseg = eredmenyHozamSzamitott[0]-eredmenyHozamSzamitott[1];
		const adoFizet = Math.round(tisztaNyereseg*(hozamAdoVariable/100));
		
		let kiirHozam = `A végső értéke a befektetésednek ${eredmenyHozamSzamitott[0]} Ft, ebből a kamat `
		+ `mértéke ${tisztaNyereseg} Ft. A hozamod után ${hozamAdoVariable}%-os adó `
		+ `mellett ${adoFizet} Ft adót kell fizetned.`;
		
		vegeredmenyHozamP.textContent = kiirHozam;
		hozamEredmenyBox.appendChild(vegeredmenyHozamP);
	}
});

inflacioForm.addEventListener("submit", function(eventInf) {
	eventInf.preventDefault();
	
	const inflacioEredmenyBox = document.getElementById("eredmeny-inflacio");
	if (inflacioEredmenyBox) {
		inflacioEredmenyBox.innerHTML = "";
	}
	
	const inflacioElsoEvInput = document.getElementById("inflacio-elso");
	const inflacioUtolsoEvInput = document.getElementById("inflacio-utolso");
	
	if (inflacioElsoEvInput.classList.contains("errorclass")) {
		inflacioElsoEvInput.classList.remove("errorclass");
	}
	
	if (inflacioUtolsoEvInput.classList.contains("errorclass")) {
		inflacioUtolsoEvInput.classList.remove("errorclass");
	}
	
	let isValid = true;
	
	if (inflacioElsoEvInput.value === "") {
		const hiba = document.createElement("p");
		hiba.textContent = "A kezdeti év megadása kötelező!";
		inflacioElsoEvInput.classList.add("errorclass");
		inflacioEredmenyBox.appendChild(hiba);
		isValid = false;
	}
	
	if (inflacioUtolsoEvInput.value === "") {
		const hiba = document.createElement("p");
		hiba.textContent = "A befejező év megadása kötelező!";
		inflacioUtolsoEvInput.classList.add("errorclass");
		inflacioEredmenyBox.appendChild(hiba);
		isValid = false;
	}
	
	if (isValid) {
		if (Number(inflacioElsoEvInput.value) <= Number(inflacioUtolsoEvInput.value)) {
			const vegeredmenyInflacio = document.createElement("p");
			const szamEredmenyIflacio = inflacioSzamitas(Number(inflacioElsoEvInput.value), Number(inflacioUtolsoEvInput.value));
			
			let kiirReplaced = `A megadott időszakban (${inflacioElsoEvInput.value}-${inflacioUtolsoEvInput.value} között)` +
			` a kumulált infláció összesen ${szamEredmenyIflacio[0]}%, az éves átlag infláció` +
			` pedig ${szamEredmenyIflacio[1]}% volt.`;
			
			kiirReplaced = kiirReplaced.replace(/(\d)\.(\d)/g, "$1,$2");
			
			vegeredmenyInflacio.textContent = kiirReplaced;
			inflacioEredmenyBox.appendChild(vegeredmenyInflacio);
		}
		else {
			const hiba = document.createElement("p");
			hiba.textContent = "A kezdeti év nem lehet nagyobb mint a befejező év!";
			inflacioElsoEvInput.classList.add("errorclass");
			inflacioUtolsoEvInput.classList.add("errorclass");
			inflacioEredmenyBox.appendChild(hiba);
		}
	}
});

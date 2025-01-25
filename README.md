# Vedur
Vedur API

## Keyrsla

### Server

Fara í `VedurAPI/bin/Release/{operating system of choice}/`
og tvísmella á VedurAPI, það ætti að keyra serverinn locally í terminal
Til að keyra test er `dotnet test` skipunin keyrð.

### Web frontend
Fara í VedurReact möppuna og keyra í terminal:
    `npm install`
    `npm run dev`
Fara á slóðina sem kemur í terminal, getur litið svona út: http://localhost:5174/


## Attribution
Aðstoð við boilerplate kóða gáfu Github Copilot og Microsoft docs. 
XML parsing kóði og debounce í React var fengið þaðan.
Unit test boilerplate hjálp fengin frá Copilot.
Css frá MaterialUI: https://mui.com/material-ui/getting-started/


## Design
Hér er Server og Web frontend fyrir skoðun á veðurgögnum frá vedur.is

### Server
Server er .net 9 web api sem er með eitt route: vedur/station/{id} þar sem id er númer veðurstöðvar.
Það eina sem serverinn gerir er að sækja gögn fyrir tiltekið id og breyta því úr xml yfir í læsilegra json, hann meðhöndlar líka algengar villur. 

Örfá unit test er að finna í VedurAPI.Tests möppunni.

### Web frontend
Web frontend er skrifað í React umhverfinu. Það er byggt með Vite sem ég hef notað í fyrra starfi og er þægilegt að vinna með.

Allt boilerplate er til staðar og svo er einn component sem heitir WeatherStation. Hann inniheldur allan kóða sem sér um að birta veður upplýsingar. 

Sá component sér um að sækja upplýsingar í serverinn og birta þær í töflu eða birta villu ef eitthvað kemur uppá.

Notandi getur sett inn tölu í input til að sækja gögn fyrir tiltekna stöð. Ef stöð finnst ekki þá er villa birt.

Debounce var bætt við á input til að sjá til þess að send séu ekki óþarfa köll á vedur.is API

Aukapakkinn MaterialUI er notaður fyrir almenna CSS uppbyggingu.


## Hugsanlegar betrumbætur
1. Það sem betur mætti gera í framtíðinni væri að bæta við bæði betra error handling og sömuleiðis logging svo hægt
    sé að greina villur frekar.

2. Eyða mætti meiri tíma í útlit á React síðunni og bæta við einhverjum preprocessor eins og SCSS.

3. Gott væri að bæta við ReactQuery fyrir client side caching á gögnum þar sem þau 
    breytast líklega ekki mjög mikið á stuttum tíma.

4. Betra væri að hafa lista yfir allar veðurstöðvar í leitanlegu dropdown svo að notandi þurfi ekki að slá inn random tölur og vona að hann lendi á réttri stöð.

5. Gott væri að hafa integration test fyrir eina routeið í bakendanum til að sjá betur hvað gerist ef að gögn skila sér ekki. Einnig væri gott að bæta við fleiri unit testum fyrir Helpers.cs þar sem xml parsing getur verið mjög brothætt.

6. Einnig mætti bæta við https skildu og cors policy og bæta öryggi almennt.

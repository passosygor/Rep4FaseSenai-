// DESAFIO 9 — Liga Anti-Bagunça da Vovó
function desafio9(liga) {
    console.log('\n--- DESAFIO 9 ---');
    console.log('Liga inicial:', liga);

    // 1. Adicione Piu-Piu somente se a lista estiver vazia.
    if (liga.length === 0) {
        liga.push('piu-piu');
        console.log('Piu-Piu adicionado (lista vazia):', liga);
    } else {
        console.log('Lista não vazia, Piu-Piu não adicionado.');
    }

    // 2. Adicione Frajola, mas coloque ele sempre na posição 0.
    let indexFrajola = liga.findIndex(nome => nome.toLowerCase() === 'frajola');
    if (indexFrajola === -1) {
        liga.unshift('frajola');
        console.log('Frajola adicionado na posição 0:', liga);
    } else {
        console.log('Frajola já existe, não adicionado novamente.');
    }

    // 3. Mova Frajola para o final apenas se existirem mais de 2 membros.
    let idxFrajola = liga.findIndex(nome => nome.toLowerCase() === 'frajola');
    if (idxFrajola !== -1 && liga.length > 2) {
        let frajola = liga.splice(idxFrajola, 1)[0];
        liga.push(frajola);
        console.log('Frajola movido para o final:', liga);
    } else {
        console.log('Frajola não movido (não existe ou menos de 3 membros).');
    }

    // 4. Verifique se todos os nomes possuem ao menos 1 letra repetida.
    function temLetraRepetida(nome) {
        let letras = nome.toLowerCase().split('');
        for (let i = 0; i < letras.length; i++) {
            if (letras.indexOf(letras[i]) !== letras.lastIndexOf(letras[i])) {
                return true;
            }
        }
        return false;
    }
    let todosComRepeticao = liga.every(temLetraRepetida);
    console.log('Todos os nomes têm pelo menos uma letra repetida?', todosComRepeticao);

    // 5. Filtre personagens que não sejam gatos e nem aves.
    let gatos = ['frajola', 'tom'];
    let aves = ['piu-piu', 'patolino', 'papa-leguas'];
    let filtrados = liga.filter(nome => {
        let n = nome.toLowerCase();
        return !gatos.includes(n) && !aves.includes(n);
    });
    console.log('Personagens que não são gatos nem aves:', filtrados);

    console.log('Liga final:', liga);
    return liga;
}
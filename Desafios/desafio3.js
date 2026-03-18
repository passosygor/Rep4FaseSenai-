// DESAFIO 3 — Lista de Caça Inteligente do Hortelino
function desafio3(lista) {
    console.log('\n--- DESAFIO 3 ---');
    console.log('Lista inicial:', lista);

    // 1. Adicione Pernalonga somente se não for o primeiro elemento já existente.
    if (lista.length > 0 && lista[0].toLowerCase() === 'pernalonga') {
        console.log('Pernalonga já é o primeiro, não adicionado.');
    } else {
        lista.push('pernalonga');
        console.log('Pernalonga adicionado ao final:', lista);
    }

    // 2. Adicione Patolino, mas coloque ele no início da lista se ainda não houver aves.
    let temAve = lista.some(nome => {
        let aves = ['patolino', 'piu-piu', 'papa-leguas'];
        return aves.includes(nome.toLowerCase());
    });
    if (!temAve) {
        lista.unshift('patolino');
        console.log('Patolino adicionado no início (sem aves):', lista);
    } else {
        console.log('Já existe ave, Patolino não adicionado.');
    }

    // 3. Remova Patolino apenas se ele estiver após o segundo índice.
    let indexPatolino = lista.findIndex(nome => nome.toLowerCase() === 'patolino');
    if (indexPatolino > 1) {
        lista.splice(indexPatolino, 1);
        console.log('Patolino removido (estava após o segundo índice).');
    } else {
        console.log('Patolino não removido (está no início ou não existe).');
    }

    // 4. Adicione Frajola somente se já existir pelo menos 2 integrantes.
    if (lista.length >= 2) {
        lista.push('frajola');
        console.log('Frajola adicionado (pelo menos 2 integrantes):', lista);
    } else {
        console.log('Menos de 2 integrantes, Frajola não adicionado.');
    }

    // 5. Filtre personagens cujo nome começa com “P” e termina com vogal.
    let vogais = ['a', 'e', 'i', 'o', 'u'];
    let filtrados = lista.filter(nome => {
        let n = nome.toLowerCase();
        return n.startsWith('p') && vogais.includes(n[n.length - 1]);
    });
    console.log('Personagens que começam com P e terminam com vogal:', filtrados);

    console.log('Lista final:', lista);
    return lista;
}
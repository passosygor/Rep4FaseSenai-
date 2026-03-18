// DESAFIO 8 — O Circo Complexo do Gaguinho
function desafio8(circo) {
    console.log('\n--- DESAFIO 8 ---');
    console.log('Circo inicial:', circo);

    // 1. Adicione Lola somente se o circo não tiver ninguém com a letra “o”.
    let temLetraO = circo.some(nome => nome.toLowerCase().includes('o'));
    if (!temLetraO) {
        circo.push('lola');
        console.log('Lola adicionada (ninguém com letra "o"):', circo);
    } else {
        console.log('Existe alguém com letra "o", Lola não adicionada.');
    }

    // 2. Insira Pernalonga na primeira posição, mas só se houver exatamente 2 artistas.
    if (circo.length === 2) {
        circo.unshift('pernalonga');
        console.log('Pernalonga inserido na primeira posição (exatamente 2 artistas):', circo);
    } else {
        console.log('Número de artistas não é 2, não inserido.');
    }

    // 3. Adicione Patolino se todos os nomes terminarem com vogal.
    let vogais = ['a', 'e', 'i', 'o', 'u'];
    let todosTerminamVogal = circo.every(nome => {
        let ultima = nome.toLowerCase().slice(-1);
        return vogais.includes(ultima);
    });
    if (todosTerminamVogal) {
        circo.push('patolino');
        console.log('Patolino adicionado (todos terminam com vogal):', circo);
    } else {
        console.log('Nem todos terminam com vogal, Patolino não adicionado.');
    }

    // 4. Crie um array com “nomeArtistas” somente dos artistas cujo nome tenha número par de letras.
    let nomeArtistas = circo.filter(nome => nome.length % 2 === 0);
    console.log('Artistas com nome de tamanho par:', nomeArtistas);

    // 5. Filtre artistas que começam com consoante e têm pelo menos 6 letras.
    let consoantes = 'bcdfghjklmnpqrstvwxyz';
    let filtrados = circo.filter(nome => {
        let primeira = nome.toLowerCase()[0];
        return consoantes.includes(primeira) && nome.length >= 6;
    });
    console.log('Artistas que começam com consoante e têm >=6 letras:', filtrados);

    console.log('Circo final:', circo);
    return circo;
}
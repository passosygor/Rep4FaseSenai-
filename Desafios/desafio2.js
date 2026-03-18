// DESAFIO 2 — A Gangue Controlada do Taz
function desafio2(gangue) {
    console.log('--- DESAFIO 2 ---');
    console.log('Gangue inicial:', gangue);

    // 1. Adicione o Taz no início do array de gangue, somente se o array estiver vazio.
    if (gangue.length === 0) {
        gangue.unshift('taz');
        console.log('Taz adicionado no início (array vazio):', gangue);
    } else {
        console.log('Array não está vazio, Taz não adicionado.');
    }

    // 2. Remova o último membro, a menos que esse membro seja o Taz.
    if (gangue.length > 0) {
        let ultimo = gangue[gangue.length - 1];
        if (ultimo.toLowerCase() !== 'taz') {
            let removido = gangue.pop();
            console.log(`Último membro (${removido}) removido, pois não é Taz.`);
        } else {
            console.log('Último membro é Taz, não removido.');
        }
    }

    // 3. Remova o primeiro membro somente se o nome dele tiver menos de 5 letras.
    if (gangue.length > 0) {
        let primeiro = gangue[0];
        if (primeiro.length < 5) {
            let removido = gangue.shift();
            console.log(`Primeiro membro (${removido}) removido por ter menos de 5 letras.`);
        } else {
            console.log('Primeiro membro tem 5 ou mais letras, não removido.');
        }
    }

    // 4. Adicione Tina apenas se existir alguém cujo nome termine com a letra “a”.
    let terminaComA = gangue.some(nome => nome.toLowerCase().endsWith('a'));
    if (terminaComA) {
        gangue.push('tina');
        console.log('Tina adicionada (existe nome terminado em "a"):', gangue);
    } else {
        console.log('Nenhum nome termina com "a", Tina não adicionada.');
    }

    // 5. Crie uma cópia contendo apenas os membros com nomes entre 5 e 8 letras.
    let copia = gangue.filter(nome => nome.length >= 5 && nome.length <= 8);
    console.log('Cópia com nomes entre 5 e 8 letras:', copia);

    console.log('Gangue final:', gangue);
    return gangue;
}
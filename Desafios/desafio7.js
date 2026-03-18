// DESAFIO 7 — Bandos Avançados do Papa-Léguas
function desafio7(bando) {
    console.log('\n--- DESAFIO 7 ---');
    console.log('Bando inicial:', bando);

    // 1. Adicione Coiote somente se o array estiver com quantidade ímpar de membros.
    if (bando.length % 2 !== 0) {
        bando.push('coiote');
        console.log('Coiote adicionado (quantidade ímpar):', bando);
    } else {
        console.log('Quantidade par, Coiote não adicionado.');
    }

    // 2. Filtre apenas os nomes com 2 vogais consecutivas.
    function temDuasVogaisConsecutivas(nome) {
        let vogais = ['a', 'e', 'i', 'o', 'u'];
        for (let i = 0; i < nome.length - 1; i++) {
            if (vogais.includes(nome[i]) && vogais.includes(nome[i+1])) {
                return true;
            }
        }
        return false;
    }
    let comVogaisConsecutivas = bando.filter(nome => temDuasVogaisConsecutivas(nome.toLowerCase()));
    console.log('Nomes com duas vogais consecutivas:', comVogaisConsecutivas);

    // 3. Concatene com ["Pernalonga", "Taz"] somente se o grupo atual tiver menos de 4 membros.
    if (bando.length < 4) {
        bando = bando.concat(['pernalonga', 'taz']);
        console.log('Concatenado com Pernalonga e Taz:', bando);
    } else {
        console.log('Grupo com 4 ou mais, não concatenado.');
    }

    // 4. Adicione Patolino caso algum nome tenha a letra “L” duas vezes.
    let temDuasLetrasL = bando.some(nome => {
        let cont = (nome.toLowerCase().match(/l/g) || []).length;
        return cont >= 2;
    });
    if (temDuasLetrasL) {
        bando.push('patolino');
        console.log('Patolino adicionado (alguém com duas letras L):', bando);
    } else {
        console.log('Nenhum nome com duas letras L, Patolino não adicionado.');
    }

    // 5. Encontre o índice do Coiote na fusão final.
    let indiceCoiote = bando.findIndex(nome => nome.toLowerCase() === 'coiote');
    console.log('Índice do Coiote:', indiceCoiote);

    console.log('Bando final:', bando);
    return bando;
}

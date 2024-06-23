const perfilSection = document.getElementById('section1');

function getApiPerfil() {
  fetch('https://api.github.com/users/RayssaMell')
    .then(async res => {
      if (!res.ok) {
        throw new Error(res.status);
      }
      var data = await res.json();

      // Atualizar imagem de perfil
      const imgPerfil = perfilSection.querySelector('.img-perfil');
      imgPerfil.src = data.avatar_url;
      imgPerfil.alt = `${data.name}'s avatar`;

      // Atualizar nome
      const nome = perfilSection.querySelector('.nome');
      nome.textContent = data.name;

      // Atualizar localização
      const location = perfilSection.querySelector('#location');
      location.textContent = data.location;

      // Atualizar número de seguidores
      const followersCount = perfilSection.querySelector('.followers-count strong');
      followersCount.textContent = data.followers;

      // Atualizar bio
      const description = perfilSection.querySelector('.description');
      description.textContent = data.bio;

      // Atualizar repositórios
      const repos = perfilSection.querySelector('.repositorios');
      repos.textContent = data.public_repos;
      
      // Atualizar site
      const website = perfilSection.querySelector('.website');
      website.href = data.html_url;
      website.textContent = data.html_url;

    }).catch(e => console.log(e));
}

getApiPerfil();

function getApiGitHub() {
  const repositoriesList = document.getElementById('repositories-list');

  fetch('https://api.github.com/users/RayssaMell/repos')
      .then(async res => {
          if (!res.ok) {
              throw new Error(res.status);
          }

          const data = await res.json();

          data.forEach(item => {
              // Criar elementos HTML para o card do repositório
              const cardCol = document.createElement('div');
              cardCol.classList.add('col-xl-4', 'col-md-6', 'aos-init', 'aos-animate');
              cardCol.setAttribute('data-aos', 'fade-up');
              cardCol.setAttribute('data-aos-delay', '100');

              const cardLink = document.createElement('a');
              cardLink.href = `repo.html?name=${encodeURIComponent(item.name)}`; // Passa o nome do repositório como parâmetro na URL
              cardLink.classList.add('card-link');

              const card = document.createElement('div');
              card.classList.add('card');

              const cardBody = document.createElement('div');
              cardBody.classList.add('card-body');

              const cardTitle = document.createElement('h5');
              cardTitle.classList.add('card-title');
              cardTitle.setAttribute('align', 'center');
              cardTitle.textContent = item.name.toUpperCase(); // Nome do repositório 

              const updatedDate = document.createElement('p');
              updatedDate.classList.add('card-text');
              updatedDate.textContent = `Última atualização: ${new Date(item.updated_at).toLocaleDateString('pt-BR')}`;

              const iconContainer = document.createElement('div');
              iconContainer.classList.add('icon-container');

              const starIcon = document.createElement('i');
              starIcon.classList.add('fa-solid', 'fa-star');
              starIcon.style.color = '#8a8e93';

              const userIcon = document.createElement('i');
              userIcon.classList.add('fa-solid', 'fa-user');

              // Montar a estrutura do card
              iconContainer.appendChild(starIcon);
              iconContainer.appendChild(userIcon);
              cardBody.appendChild(cardTitle);
              cardBody.appendChild(updatedDate); 
              cardBody.appendChild(iconContainer);
              card.appendChild(cardBody);
              cardLink.appendChild(card);
              cardCol.appendChild(cardLink);

              // Adicionar o card à lista de repositórios
              repositoriesList.appendChild(cardCol);
          });
      })
      .catch(e => console.error('Erro ao buscar repositórios:', e));
}

getApiGitHub();

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const repoName = urlParams.get('name');

    if (repoName) {
        fetch('https://api.github.com/users/RayssaMell/repos')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const repo = data.find(r => r.name === repoName);

                if (repo) {
                    document.querySelector('.repositorio-nome').innerHTML += repo.name;
                    document.getElementById('data-criacao').innerHTML = new Date(repo.created_at).toLocaleDateString();
                    document.getElementById('linguagem').innerHTML = repo.language;
                    const linkAcesso = document.getElementById('link-acesso');
                    linkAcesso.href = repo.svn_url;
                    linkAcesso.innerHTML = repo.svn_url;
                    document.querySelector('.followers-count').innerHTML = repo.subscribers_count || 0;
                    document.querySelector('.stars-count').innerHTML = repo.stargazers_count || 0;

                    const topicsContainer = document.getElementById('repo-topics');
                    if (repo.topics) {
                        repo.topics.forEach(topic => {
                            topicsContainer.innerHTML += `<button type="button" class="btn btn-lg">${topic}</button>`;
                        });
                    }
                } else {
                    console.error('Repositório não encontrado');
                }
            })
            .catch(error => console.error('Error fetching repo:', error));
    }
});


// Conteudo Sugeridos //
const urlConteudo = '/conteudos';
const urlColegas = '/colegas';
let conteudos = [];
let colegas = [];

function carregaDadosJSONServer(func) {
    Promise.all([
        fetch(urlConteudo).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        }),
        fetch(urlColegas).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
    ])
    .then(([dadosConteudos, dadosColegas]) => {
        console.log('dadosConteudos:', dadosConteudos);
        console.log('dadosColegas:', dadosColegas);

        conteudos = dadosConteudos; 
        colegas = dadosColegas; 

        if (!Array.isArray(conteudos)) {
            throw new Error('conteudos is not an array or is undefined');
        }
        if (!Array.isArray(colegas)) {
            throw new Error('colegas is not an array or is undefined');
        }

        console.log('Dados carregados!');
        func();
    })
    .catch(error => {
        console.error('Erro ao carregar dados:', error);
    });
}

function montaCarousel() {
    const carouselIndicators = document.querySelector('.carousel-indicators');
    const carouselInner = document.querySelector('.carousel-inner');

    // Limpa conteúdo atual
    carouselIndicators.innerHTML = '';
    carouselInner.innerHTML = '';

    // Preenche os indicadores e os itens do carrossel
    conteudos.forEach((conteudo, index) => {
        // Cria um indicador para cada item
        const indicator = document.createElement('button');
        indicator.setAttribute('type', 'button');
        indicator.setAttribute('data-bs-target', '#carouselExampleIndicators');
        indicator.setAttribute('data-bs-slide-to', index.toString());
        if (index === 0) {
            indicator.classList.add('active');
        }
        carouselIndicators.appendChild(indicator);

        // Cria o item do carrossel
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
            carouselItem.classList.add('active');
        }
        carouselItem.innerHTML = `
            <img src="${conteudo.urlImg}" class="d-block w-100" alt="${conteudo.titulo}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${conteudo.titulo}</h5>
                <p>${conteudo.descricao}</p>
                <a href="${conteudo.urlConteudo}" class="btn btn-primary">Saiba mais</a>
            </div>
        `;
        carouselInner.appendChild(carouselItem);
    });
}

function montaColegas() {
    const colegasRow = document.getElementById('colegasRow');

    // Limpa conteúdo atual
    colegasRow.innerHTML = '';

    // Preenche os itens dos colegas
    colegas.forEach(colega => {
        const colegaDiv = document.createElement('div');
        colegaDiv.classList.add('col-4', 'sm-2');
        colegaDiv.innerHTML = `
            <img src="${colega.urlFoto}" class="d-block w-100" alt="${colega.nome}">
            <p class="colegas">
                <a href="${colega.urlPerfil}" target="_blank">${colega.nome}</a>
            </p>
        `;
        colegasRow.appendChild(colegaDiv);
    });
}

// Carrega os dados ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    carregaDadosJSONServer(function() {
        montaCarousel();
        montaColegas();
    });
});

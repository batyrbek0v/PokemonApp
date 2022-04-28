
const $wrapper = document.querySelector('.wrapper')
const $container = document.querySelector('.container')
const $next = document.querySelector('.next')
const $prev = document.querySelector('.prev')
const $currentPage = document.querySelector('.currentPage')
const $allPages = document.querySelector('.allPages')
const $pageInput = document.querySelector('.pageInput')
const $inputBtn = document.querySelector('.inputBtn')
const $btns = document.querySelector('.buttons')
const $selectPage = document.querySelector('.selectPage')
const $select = document.querySelector('.select')

const BASE_URL = 'https://pokeapi.co/api/v2/'

const LIMIT = 9

const ALL_POKEMONS = 1126
const ALL_PAGES = Math.floor(ALL_POKEMONS / LIMIT)

let offSetCounter = 0
let currentPage = 1
let selectPage = 1	


window.addEventListener('load', () => {
  getData(`${BASE_URL}pokemon`, `limit=${LIMIT}&offset=${offSetCounter}`, cb => {
   cardTemplate(cb.results)
  })
})

function getData(url,query,callBack) {
  fetch(`${url}?${query}`)
  .then(res => res.json())
  .then(response => {
    callBack(response);
  })
}

function cardTemplate(base) {
  const template = base.map(({url,name,}) => `
    <div class="card">
      <div class="card_title">
        <h2>${name}</h2>
      </div>
      <div class="card_body">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1280px-International_Pok%C3%A9mon_logo.svg.png">
      </div>
      <div class="card_footer">
        <button onclick="moreInfo('${url}')" class="moreBtn">More...</button>
      </div>
    </div>
  `).join('')
  $wrapper.innerHTML = template
	console.log(base);

}

function moreInfo(url) {
  getData(url, '', cb => {
    $container.innerHTML = `
		<div class="more_container">
			<div class="single_main">
				<div class="single">
					<div class="more_title">
						<h1>${cb.name} #${cb.id}</h1>
					</div>
					<img src="${cb.sprites.other.dream_world.front_default}" alt=""pokemonImage>
				</div>
			</div>
			<div class="stats_container">
				<div class="stats_block">
					<ul class="more_list">
						<li>Weigth: <span>${(cb.weight / 10)} kg</span></li>
						<li>Height: <span>${(cb.height / 10)} meter</span></li>
						<li>Ability: <span>${cb.abilities[0].ability.name}</span></li>
						<li>Base experience: ${cb.base_experience}</li>
						<li>Type: ${cb.types[0].type.name}</li>
					</ul>
				</div>
				<div class="stats_block2">
					<div class="stats_inline">
						<div class="stats">
							<div class="progress" style="height:${cb.stats[0].base_stat}pt;">${cb.stats[0].base_stat}</div>
							<h2><i class="fa fa-heart"></i></h2>
						</div>
						<div class="stats">
							<div class="progress" style="height:${cb.stats[1].base_stat}pt;">${cb.stats[1].base_stat}</div>
							<h2><i class="fas fa-fist-raised"></i></h2>
						</div>
						<div class="stats">
							<div class="progress" style="height:${cb.stats[2].base_stat}pt;">${cb.stats[2].base_stat}</div>
							<h2><i class="fas fa-shield-alt"></i></h2>
						</div>
						<div class="stats">
							<div class="progress" style="height:${cb.stats[3].base_stat}pt;">${cb.stats[3].base_stat}</div>
							<h2><i class="fas fa-fist-raised"></i></h2>
						</div>
						<div class="stats">
							<div class="progress" style="height:${cb.stats[4].base_stat}pt;">${cb.stats[4].base_stat}</div>
							<h2><i class="fas fa-shield-alt"></i></h2>
						</div>
						<div class="stats">
							<div class="progress" style="height:${cb.stats[5].base_stat}pt;">${cb.stats[5].base_stat}</div>
							<h2><i class="fas fa-bolt"></i></h2>
						</div>
					</div>
				</div>
			</div>
			<div class="back">
				<button onclick="goBack()" class="backBtn">Back</button>
			</div>
		</div>
	`
	console.log(cb);
	$btns.classList.add('deleted')
	$selectPage.classList.add('deleted')

  })
}

function goBack() {
	window.location.reload()
}

window.addEventListener('load' , () => {
	$allPages.innerHTML = ALL_PAGES 
	$currentPage.innerHTML = currentPage
	$prev.setAttribute('disabled', true)

})


$next.addEventListener('click', e => {
	e.preventDefault()
	offSetCounter += LIMIT
	currentPage++

	if(currentPage === ALL_PAGES ){
		$next.setAttribute('disabled' , true)
	}

	changePage()


	$prev.removeAttribute('disabled')

	getData(`${BASE_URL}pokemon`, `limit=${LIMIT}&offset=${offSetCounter}`, cb => {
		cardTemplate(cb.results)
	})
})
$prev.addEventListener('click', e => {
	e.preventDefault()
	offSetCounter -= LIMIT
	currentPage-- 

	if(currentPage === 1){
		$prev.setAttribute('disabled', true)
	}

	changePage()

	$next.removeAttribute('disabled')
	
	getData(`${BASE_URL}pokemon` , `limit=${LIMIT}&offset=${offSetCounter}`, cb => {
		cardTemplate(cb.results)
	})
})



$pageInput.addEventListener('input', e => {
	selectPage = e.target.value.toUpperCase().trim()
	const selectedValue = $select.value
	if(selectedValue === 'name'){
		getData(`${BASE_URL}pokemon`, `limit=${ALL_POKEMONS}&offset=${offSetCounter}`, cb => {
			const filtered = cb.results.filter(item => item.name.toUpperCase().includes(selectPage))
			cardTemplate(fi)
		})
	}
})

$inputBtn.addEventListener('click', e => {
	e.preventDefault()
	if(selectPage > ALL_PAGES || selectPage < 1 || selectPage === currentPage) {
		Swal.fire({
			title: 'Что-то пошло не так!',
			text: 'Выберите корректное значение',
			icon: 'error',
			confirmButtonText: 'Ok'
		})
		$pageInput.value = ''
	}else {
		const selectedOffSet = selectPage * LIMIT - LIMIT

		offSetCounter = selectedOffSet

		$currentPage.innerHTML = selectPage
		currentPage = selectPage

		if(selectPage !== 1) {
			$prev.removeAttribute('disabled')
		}else{
			$prev.setAttribute('disabled', true)
		}

		if(selectPage !== ALL_PAGES) {
			$next.removeAttribute('disabled')
		} else{
			$next.setAttribute('disabled', true)
		}

		getData(`${BASE_URL}pokemon`, `limit=${LIMIT}&offset=${selectedOffSet}`, cb =>{
			cardTemplate(cb.results)
		})
	}
	$pageInput.value = ''

})
function changePage() {
	$currentPage.innerHTML = currentPage
}



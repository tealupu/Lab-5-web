document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchStatus = document.getElementById('searchStatus');

    let debounceTimer;

    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.trim();
        clearTimeout(debounceTimer);

        if (searchTerm === '') {
            searchResults.innerHTML = '';
            searchStatus.textContent = '';
            return;
        }

        searchStatus.textContent = 'Searching...';

        debounceTimer = setTimeout(() => {
            if (searchTerm.length >= 2) {
                fetchCountries(searchTerm);
            } else {
                searchStatus.textContent = 'Please enter at least 2 characters';
                searchResults.innerHTML = '';
            }
        }, 500);
    });

    function fetchCountries(searchTerm) {
        if (!searchTerm) return;

        fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(searchTerm)}`)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        return Promise.reject('No countries found');
                    }
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) {
                    throw new Error('No countries found');
                }
                displayResults(data);
                searchStatus.textContent = `Found ${data.length} ${data.length === 1 ? 'country' : 'countries'}`;
            })
            .catch(error => {
                searchResults.innerHTML = `<div class="no-results">${error}</div>`;
                searchStatus.textContent = '';
                console.error('Error:', error);
            });
    }

    function displayResults(countries) {
        if (!countries || countries.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No countries found</div>';
            return;
        }

        searchResults.innerHTML = ""; 

        const countryList = countries.map(country => {
            return `
                <div class="country-item"> 
                    <img src="${country.flags?.png || ''}" 
                         alt="${country.flags?.png ? country.name.common + ' flag' : 'Flag not available'}" 
                         class="country-flag">
                    <div class="country-details">
                        <div><strong>Country:</strong> ${country.name.common}</div>
                        <div><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</div>
                        <div><strong>Population:</strong> ${country.population.toLocaleString()}</div>
                    </div>
                </div>
            `;
        }).join('');

        searchResults.innerHTML = countryList;
    }
});


    

        
        

window.Book={
    init: function(frame, store){
        // initialisation stuff here
        const characterListDom = $("<ul class='character-list'></ul>");
        frame.append(characterListDom);
        $( document ).ready(()=> {
            this.fetchBooks(store).then(
                characters => this.fillListWitchCharacters(characterListDom, characters)
            )
        });
    },
    fillListWitchCharacters: function(characterListDom, characters){
        characters.forEach(character =>{
            const characterListItem = `
            <li>
                <header>
                    <h2>${character.name}</h2>
                </header>
            </li>`
            characterListDom.append(characterListItem);
        })
    },
    fetchBooks: async function(store){
        return store.getCharacters().then(
            characters => {
                return characters;
            }
        )
        .catch(
            error => {
                return error
            })
    },
}



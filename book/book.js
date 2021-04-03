window.Book = {
    init: function (frame, store) {
        // initialisation stuff here
        const characterListDom = $("<ul class='character-list'></ul>");

        frame.append(characterListDom);
        $(document).ready(() => {

            this.fetchCharacters(store).then(
                characters => this.fillListWithCharacters(characterListDom, characters)
            )
        })
    },
    fillListWithCharacters: function (characterListDom, characters) {
        characters.sort((a, b) => a.name.localeCompare(b.name))
        characters.forEach(character => {
            const characterListItem = $(`
            <li class='character-list__item' data-isSelected = "false">
                <header>
                    <h2>${character.name}</h2>
                </header>
                <section>
                    <span>${character.species}</span>
                </section>
            </li>`)

            characterListItem.attr("data-isSelected", false)
            const itemClick = this.onCharacterClick;
            characterListItem.on("click", function () {
                itemClick(this, character);
            })
            characterListDom.append(characterListItem);
        })
    },
    fetchCharacters: function (store) {
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
    onCharacterClick: function (domItem, character) {
        const clickedItem = $(domItem);
        $(".character-list").find(`[data-isSelected=true]`).data("data-isSelected", false).removeClass('character-list__item--selected')
        clickedItem.attr("data-isSelected", true);
        clickedItem.addClass('character-list__item--selected')
    },

}
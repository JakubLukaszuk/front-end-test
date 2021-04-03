window.Book = {
    init: function (frame, store) {
        // initialisation stuff here
        console.log(this);
        this.Api.store = store;
        const characterListDom = $("<ul class='character-list'></ul>");
        const characterForm = $(`
        <form>
            <label for="name">Name</label>
            <input type="text" id="name">

            <label for="female">Species</label>
            <input type="text" id="species">

            <img id="picture"/>

            <label for="other">Description</label>
            <input type="text" id="description">

            <input type="submit" value="Submit">
        </form>
        `);

        frame.append(characterForm);

        frame.append(characterListDom);
        $(document).ready(() => {

            this.Api.fetchCharacters().then(
                characters => this.List.fillListWithCharacters(characterListDom, characters, store)
            )
        })
    },
    Api: {
        store: null,
        fetchCharacters: function () {
            return this.store.getCharacters().then(
                    characters => {
                        return characters;
                    }
                )
                .catch(
                    error => {
                        return error
                    })
        },
        fetchCharacterDetails: function (id) {
            return this.store.getCharacterDetails(id).then(
                    details => {
                        return details;
                    }
                )
                .catch(
                    error => {
                        return error
                    })
        },
    },
    List: {
        fillListWithCharacters: function (characterListDom, characters, store) {
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
                const itemClick = this.onCharacterItemClick;
                characterListItem.on("click", function () {
                    itemClick(this, character, store);
                })
                characterListDom.append(characterListItem);
            })
        },

        onCharacterItemClick: function (domItem, character, store) {
            const clickedItem = $(domItem);
            $(".character-list").find(`[data-isSelected=true]`).data("data-isSelected", false).removeClass('character-list__item--selected')
            clickedItem.attr("data-isSelected", true);
            clickedItem.addClass('character-list__item--selected')
            this.Book.Api.fetchCharacterDetails(character.id).then(
                details => this.Book.Form.fillCharacterForm(details)
            )
        },

    },
    Form: {
        selectedCharacter: null,
        fillCharacterForm: function (details) {
            this.selectedCharacter = details
            $("#name").attr('value', details.name)
            $("#picture").attr('src', details.picture)
            $("#species").attr('value', details.species)
            $("#description").attr('value', details.description)
        }
    },

}
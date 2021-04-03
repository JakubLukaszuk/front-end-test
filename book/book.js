window.Book = {
    init: function (frame, store) {
        // initialisation stuff here
        this.Api.store = store;
        this.List.init(frame);
        this.Form.init(frame);
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
        updateCharacter: function (character) {
            return this.Book.Api.store.updateCharacter(character).then(
                    details => {
                        return details;
                    }
                )
                .catch(
                    error => {
                        return error
                    })
        }
    },
    List: {
        init: (frame) => {
            const characterListDom = $("<ul class='character-list'></ul>");
            frame.append(characterListDom);
            $(document).ready(() => {
                this.Book.Api.fetchCharacters().then(
                    characters => this.Book.List.fillListWithCharacters(characterListDom, characters)
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
                const itemClick = this.onCharacterItemClick;
                characterListItem.on("click", function () {
                    itemClick(this, character);
                })
                characterListDom.append(characterListItem);
            })
        },

        onCharacterItemClick: function (domItem, character) {
            const clickedItem = $(domItem);
            $(".character-list").find(`[data-isSelected=true]`).data("data-isSelected", false).removeClass('character-list__item--selected')
            clickedItem.attr("data-isSelected", true);
            clickedItem.addClass('character-list__item--selected')
            this.Book.Api.fetchCharacterDetails(character.id).then(
                details => this.Book.Form.fillCharacterForm(details)
            )
        },
        removeList: function () {
            $(".character-list").remove();
        }
    },
    Form: {
        selectedCharacter: null,
        init: (frame) => {
            const characterForm = $(`
            <form>
                <label for="name">Name</label>
                <input type="text" id="name">

                <label for="female">Species</label>
                <input type="text" id="species">

                <img id="picture"/>

                <label for="other">Description</label>
                <input type="text" id="description">

            </form>
            `);

            const submitFormButton = $('<input type="submit" value="Submit"/>');

            submitFormButton.on('click', (e) => {
                e.preventDefault();
                this.Book.Form.submitChanges(e, this.Book.Api.updateCharacter);
                this.Book.List.removeList();
                this.Book.List.init(frame);
            })
            characterForm.append(submitFormButton);
            frame.append(characterForm);
        },

        fillCharacterForm: function (details) {
            this.selectedCharacter = details
            $("#name").val(details.name)
            $("#picture").attr('src', details.picture)
            $("#species").val( details.species)
            $("#description").val( details.description)
        },
        getModifedValue: function () {
            let isModifed= false;
            const newName = $("#name").val();
            const newSpecies = $("#species").val();
            const newDescription = $("#description").val();

            var newCharacterData = Object.assign({}, this.selectedCharacter);


            if ( newName !== newCharacterData.name){
                newCharacterData.name = newName;
                isModifed= true;
            }
            if(newSpecies !== newCharacterData.species)
            {
                newCharacterData.species = species;
                isModifed= true;
            }
            if(newDescription !== newCharacterData.description)
            {
                newCharacterData.description = description;
                isModifed= true;
            }
            if(!isModifed)
            {
                return false
            }
            return newCharacterData
        },
        submitChanges: function (event, updateCharacter) {
            event.preventDefault();
            console.log(this);
            const modifedValue = this.getModifedValue();
            if (modifedValue) {
                updateCharacter(modifedValue);
            }
        }
    },

}
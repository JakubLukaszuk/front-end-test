window.Book = {
    init: function (frame, store) {
        // initialisation stuff here
        this.Api.store = store;
        const wraper = $("<div class='book'></div>");
        const characterListDom = $("<ul class='list book__character-list'></ul>");
        wraper.append(characterListDom);
        frame.append(wraper);
        this.List.init(characterListDom);
        this.Form.init(wraper, characterListDom);
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
                    characters => {
                        return characters;
                    }
                )
                .catch(
                    error => {
                        return error
                    })
        },

        deleteCharacter: function (id) {
            return this.store.deleteCharacter(id).then(
                response => {
                    return response;
                }
            )
            .catch(
                error => {
                    return error
                })
        }
    },
    List: {
        init: (characterListDom) => {

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
                <li class='item book__character-list__item' data-selected = "false">
                    <header class='book__character-list__item--name'>
                        <h2 class='name'>${character.name}</h2>
                    </header>
                    <section class='book__character-list__item--species'>
                        <span class='species'>${character.species}</span>
                    </section>
                </li>`)

                characterListItem.attr("data-selected", false)
                characterListItem.attr("data-id", character.id)
                const itemClick = this.onCharacterItemClick;
                characterListItem.on("click", function () {
                    itemClick(this, character);
                })
                characterListDom.append(characterListItem);
            })
        },

        onCharacterItemClick: function (domItem, character) {
            const clickedItem = $(domItem);
            $(".book__character-list").find(`[data-selected=true]`).data("data-selected", false).removeClass('item--selected')
            clickedItem.attr("data-selected", true);
            $("#editCharacter").attr('disabled', function(_, attr){ return !attr});
            $("#cancelButton").attr('disabled', function(_, attr){ return !attr});
            clickedItem.addClass('item--selected')
            this.Book.Api.fetchCharacterDetails(character.id).then(
                details => this.Book.Form.fillCharacterForm(details)
            )
        },
        cleanUpList: function () {
            $(".character-list").empty();
        },
        removeItemList: function (id) {
            $(".character-list").find(`[data-id=${id}]`).remove();
        }
    },
    Form: {
        selectedCharacter: null,
        init: (wraper, characterListDom) => {
            const characterDetails = $(`
            <section class='book__character-details'>
                <form id="form" class='details editor book__character-details_character-form'>
                    <label class='book__character-details_character-form--label' for="name">Name</label>
                    <input name="name" class='name book__character-details_character-form--input' type="text" id="name" disabled="true">

                    <label class='book__character-details_character-form--label' for="female">Species</label>
                    <input name="species" class='species book__character-details_character-form--input' type="text" id="species" disabled="true">

                    <img class="book__character-details_character-form--picture" id="picture"/>

                    <label class='book__character-details_character-form--label' for="description">Description</label>
                    <input name="description" class='description book__character-details_character-form--input' type="text" id="description" disabled="true">
                </form>
            </section>

            `);
            const editCharacterButton = $('<button id="editCharacter" disabled="true" class="edit book__character-form__modifyPanel--btn">Edit</button>');
            const submitFormButton = $('<input type="submit" disabled="true" class="save book__character-form__modifyPanel--btn" value="Submit"/>');
            const deleteButton = $('<button id="deleteCharacter" class="book__character-form__modifyPanel--btn" disabled="true">Delete</button>');
            const cancelButton= $('<button id="cancelButton" class="cancel book__character-form__modifyPanel--btn to-right" disabled="true">Cancel</button>')
            const buttonPanel = $('<section id="buttonPanel" class="book__character-form__modifyPanel"></section>')

            const toggleFormDisability = this.Book.Form.toggleFormDisability;

            editCharacterButton.on('click', function(e) {
                editCharacterButton.toggleClass('is-active');
                e.preventDefault();
                toggleFormDisability();
            })

            submitFormButton.on('click', (e) => {
                e.preventDefault();
                this.Book.Form.submitChanges(e, this.Book.Api.updateCharacter);
                toggleFormDisability();
                this.Book.List.cleanUpList();
                this.Book.List.init(characterListDom);
            })

            const cancel = () => {
                toggleFormDisability();
                this.Book.Form.fillCharacterForm({
                    name: null,
                    picture: null,
                    species: null,
                    description: null
                });
            }

            deleteButton.on('click', (e) => {
                e.preventDefault();
                const id = this.Book.Form.selectedCharacter.id;
                this.Book.Api.deleteCharacter(id).then(
                    () => {
                        this.Book.List.removeItemList(id);
                        cancel();
                    }
                )
            })

            cancelButton.on('click', (e) => {
                e.preventDefault();
                cancel();
            })

            buttonPanel.append(editCharacterButton);
            buttonPanel.append(submitFormButton);
            buttonPanel.append(deleteButton);
            buttonPanel.append(cancelButton);

            characterDetails.append(buttonPanel);

            wraper.append(characterDetails);
        },

        toggleFormDisability: function () {
            $("#form :input").attr('disabled', function(_, attr){ return !attr});
            $("#buttonPanel :input:not(#editCharacter):not(#cancelButton)").attr('disabled', function(_, attr){ return !attr});
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
            const modifedValue = this.getModifedValue();
            if (modifedValue) {
                updateCharacter(modifedValue);
            }
        }
    },

}
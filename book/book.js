window.Book = {
    init: function (frame, store) {
        // initialisation stuff here
        this.Api.store = store;
        const characterListDom = $("<ul class='character-list'></ul>");
        frame.append(characterListDom);
        this.List.init(characterListDom);
        this.Form.init(frame, characterListDom);
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
                <li class='character-list__item' data-isSelected = "false">
                    <header>
                        <h2>${character.name}</h2>
                    </header>
                    <section>
                        <span>${character.species}</span>
                    </section>
                </li>`)

                characterListItem.attr("data-isSelected", false)
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
            $(".character-list").find(`[data-isSelected=true]`).data("data-isSelected", false).removeClass('character-list__item--selected')
            clickedItem.attr("data-isSelected", true);
            clickedItem.addClass('character-list__item--selected')
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
        init: (frame, characterListDom) => {
            const characterForm = $(`
            <form id="form" class='character-form'>
                <label for="name">Name</label>
                <input type="text" id="name" disabled="true">

                <label for="female">Species</label>
                <input type="text" id="species" disabled="true">

                <img id="picture"/>

                <label for="other">Description</label>
                <input type="text" id="description" disabled="true">

            </form>
            `);

            const editCharacterButton = $('<button id="editCharacter">Edit</button>');
            const submitFormButton = $('<input type="submit" disabled="true" value="Submit"/>');
            const deleteButton = $('<button id="deleteCharacter" disabled="true">Delete</button>');

            const toggleInputsDisability = this.Book.Form.toggleFormInputsDisability;

            editCharacterButton.on('click', (e) => {
                e.preventDefault();
                toggleInputsDisability();
            })

            submitFormButton.on('click', (e) => {
                e.preventDefault();
                this.Book.Form.submitChanges(e, this.Book.Api.updateCharacter);
                toggleInputsDisability();
                this.Book.List.cleanUpList();
                this.Book.List.init(characterListDom);

            })

            deleteButton.on('click', (e) => {
                e.preventDefault();
                const id = this.Book.Form.selectedCharacter.id;
                this.Book.Api.deleteCharacter(id).then(
                    () => {
                        this.Book.List.removeItemList(id);
                        toggleInputsDisability();
                        this.Book.Form.fillCharacterForm({
                            name: null,
                            picture: null,
                            species: null,
                            description: null
                        });
                    }
                )
            })

            characterForm.append(editCharacterButton);
            characterForm.append(submitFormButton);
            characterForm.append(deleteButton);

            frame.append(characterForm);
        },

        toggleFormInputsDisability: function () {
            $("#form :input:not(#editCharacter)").attr('disabled', function(_, attr){ return !attr});
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
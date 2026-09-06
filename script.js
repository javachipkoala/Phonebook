/* =====================================
   PHONEBOOK APPLICATION
   Local Storage Contact Management
===================================== */


/* =====================================
   STORAGE
===================================== */

const STORAGE_KEY = "phonebookContacts";

let contacts =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];


/* =====================================
   GET HTML ELEMENTS
===================================== */

const contactForm =
    document.getElementById("contactForm");

const nameInput =
    document.getElementById("name");

const phoneInput =
    document.getElementById("phone");

const emailInput =
    document.getElementById("email");

const addressInput =
    document.getElementById("address");

const searchInput =
    document.getElementById("searchInput");

const contactsContainer =
    document.getElementById("contactsContainer");

const emptyState =
    document.getElementById("emptyState");

const contactCount =
    document.getElementById("contactCount");

const formTitle =
    document.getElementById("formTitle");

const saveBtn =
    document.getElementById("saveBtn");

const cancelEdit =
    document.getElementById("cancelEdit");

const editIndex =
    document.getElementById("editIndex");


/* =====================================
   SAVE CONTACTS TO LOCAL STORAGE
===================================== */

function saveContacts() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(contacts)
    );

}


/* =====================================
   GENERATE INITIALS
===================================== */

function getInitials(name) {

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");

}


/* =====================================
   PREVENT HTML INJECTION
===================================== */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;

}


/* =====================================
   DISPLAY CONTACTS
===================================== */

function renderContacts(list = contacts) {

    contactsContainer.innerHTML = "";

    /*
       Display total number of contacts
    */

    contactCount.textContent = contacts.length;


    /*
       Show empty message if no contacts
    */

    if (list.length === 0) {

        emptyState.classList.remove("d-none");

        return;

    }

    emptyState.classList.add("d-none");


    /*
       Create contact cards
    */

    list.forEach(function (item) {

        const contact = item.contact;

        const originalIndex = item.index;


        const card =
            document.createElement("div");

        card.className = "col-md-6";


        card.innerHTML = `

            <div class="contact-card">

                <!-- Contact Header -->

                <div class="d-flex align-items-center gap-3">

                    <div class="contact-avatar">

                        ${escapeHTML(
                            getInitials(contact.name)
                        )}

                    </div>

                    <div>

                        <h5 class="mb-0 fw-bold">

                            ${escapeHTML(
                                contact.name
                            )}

                        </h5>

                        <small class="text-muted">
                            Contact
                        </small>

                    </div>

                </div>


                <!-- Contact Details -->

                <div class="contact-info mt-3">

                    <div>
                        📞
                        ${escapeHTML(
                            contact.phone
                        )}
                    </div>
                    ${
                        contact.email
                        ?
                        `
                        <div>
                            ✉️
                            ${escapeHTML(
                                contact.email
                            )}
                        </div>
                        `
                        :
                        ""
                    }


                    ${
                        contact.address
                        ?
                        `
                        <div>
                            📍
                            ${escapeHTML(
                                contact.address
                            )}
                        </div>
                        `
                        :
                        ""
                    }

                </div>

                <div class="d-flex gap-2 mt-3">

                    <button
                        class="btn btn-sm btn-outline-primary action-btn"
                        onclick="editContact(${originalIndex})"
                    >
                        Edit
                    </button>


                    <button
                        class="btn btn-sm btn-outline-danger action-btn"
                        onclick="deleteContact(${originalIndex})"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `;


        contactsContainer.appendChild(card);

    });

}


/* =====================================
   SEARCH CONTACTS
===================================== */

function searchContacts() {

    const query =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredContacts = contacts

        .map(function (contact, index) {

            return {
                contact: contact,
                index: index
            };

        })

        .filter(function (item) {

            const contact = item.contact;


            return (

                contact.name
                    .toLowerCase()
                    .includes(query)

                ||

                contact.phone
                    .toLowerCase()
                    .includes(query)

                ||

                (contact.email || "")
                    .toLowerCase()
                    .includes(query)

                ||

                (contact.address || "")
                    .toLowerCase()
                    .includes(query)

            );

        });


    renderContacts(filteredContacts);

}


/* =====================================
   ADD / UPDATE CONTACT
===================================== */

contactForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /*
           Create contact object
        */

        const contact = {

            name:
                nameInput.value.trim(),

            phone:
                phoneInput.value.trim(),

            email:
                emailInput.value.trim(),

            address:
                addressInput.value.trim()

        };


        /*
           Check whether user is editing
        */

        const index =
            editIndex.value;


        if (index === "") {

            /*
               Add new contact
            */

            contacts.push(contact);

        }

        else {

            /*
               Update existing contact
            */

            contacts[
                Number(index)
            ] = contact;

        }


        /*
           Save changes
        */

        saveContacts();


        /*
           Reset form
        */

        resetForm();


        /*
           Refresh contact list
        */

        searchContacts();

    }
);


/* =====================================
   EDIT CONTACT
===================================== */

function editContact(index) {

    const contact =
        contacts[index];


    /*
       Put contact information
       back into the form
    */

    nameInput.value =
        contact.name;

    phoneInput.value =
        contact.phone;

    emailInput.value =
        contact.email;

    addressInput.value =
        contact.address;


    /*
       Store index
    */

    editIndex.value =
        index;


    /*
       Change form appearance
    */

    formTitle.textContent =
        "Edit Contact";

    saveBtn.textContent =
        "Update Contact";

    cancelEdit.classList.remove(
        "d-none"
    );


    /*
       Scroll to form
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================
   DELETE CONTACT
===================================== */

function deleteContact(index) {

    const contactName =
        contacts[index].name;


    const confirmation =
        confirm(
            `Delete ${contactName} from your phonebook?`
        );


    if (confirmation) {

        contacts.splice(index, 1);

        saveContacts();

        searchContacts();

    }

}


/* =====================================
   RESET FORM
===================================== */

function resetForm() {

    contactForm.reset();

    editIndex.value = "";

    formTitle.textContent =
        "Add Contact";

    saveBtn.textContent =
        "Save Contact";

    cancelEdit.classList.add(
        "d-none"
    );

}


/* =====================================
   CANCEL EDIT
===================================== */

cancelEdit.addEventListener(
    "click",
    function () {

        resetForm();

    }
);


/* =====================================
   SEARCH EVENT
===================================== */

searchInput.addEventListener(
    "input",
    function () {

        searchContacts();

    }
);


/* =====================================
   INITIAL DISPLAY
===================================== */

function renderContacts(list = contacts) {

    contactsContainer.innerHTML = "";

    contactCount.textContent = contacts.length;

    if (list.length === 0) {
        emptyState.classList.remove("d-none");
        return;
    }

    emptyState.classList.add("d-none");

    list.forEach(function (item, position) {

        // Support both raw contacts and indexed contacts
        const contact = item.contact || item;
        const originalIndex =
            item.index !== undefined
                ? item.index
                : position;

        const card = document.createElement("div");

        card.className = "col-md-6";

        card.innerHTML = `
            <div class="contact-card">

                <div class="d-flex align-items-center gap-3">

                    <div class="contact-avatar">
                        ${escapeHTML(getInitials(contact.name))}
                    </div>

                    <div>
                        <h5 class="mb-0 fw-bold">
                            ${escapeHTML(contact.name)}
                        </h5>

                        <small class="text-muted">
                            Contact
                        </small>
                    </div>

                </div>

                <div class="contact-info mt-3">

                    <div>
                        📞 ${escapeHTML(contact.phone)}
                    </div>

                    ${
                        contact.email
                        ? `<div>✉️ ${escapeHTML(contact.email)}</div>`
                        : ""
                    }

                    ${
                        contact.address
                        ? `<div>📍 ${escapeHTML(contact.address)}</div>`
                        : ""
                    }

                </div>

                <div class="d-flex gap-2 mt-3">

                    <button
                        class="btn btn-sm btn-outline-primary action-btn"
                        onclick="editContact(${originalIndex})">
                        Edit
                    </button>

                    <button
                        class="btn btn-sm btn-outline-danger action-btn"
                        onclick="deleteContact(${originalIndex})">
                        Delete
                    </button>

                </div>

            </div>
        `;

        contactsContainer.appendChild(card);
    });
}
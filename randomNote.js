/*
Random Roam Page filtered by word or emoji
By Erik Newhard
https://roamresearch.com/#/app/roam-depot-developers/page/PO5Thyfe0
*/

; (() => {
    // SETTINGS
    // Change this to the word or emoji contained in the page titles that you would like to appear randomly
    var titleFilter = "🌱"
  
    // init
    const button_id = "randomRoamPage"

    const button = document.getElementById(button_id)
    if (button) {
        console.log(button_id + ' already loaded')
        return
    }

    let roamPageIndex = 0,
        randomRoamPagesList = shuffleArray(userFilteredPagesList())

    addButton()


    // functions
    function userFilteredPagesList() {
        return window.roamAlphaAPI.q(`[:find (pull ?page [:block/uid :block/children :node/title]) :where [?page :node/title]]`)
            .filter(x => x[0].title.includes(titleFilter))
            .map(x => x[0].uid)
    }

    function shuffleArray(array) {
        const a = array.slice()

        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]]
        }

        return a
    }

    function addButton() {
        const topbar = document.querySelector('.rm-topbar')

        if (topbar) {
            const button = Object.assign(document.createElement('div'), {
                id: button_id,
                className: "bp3-button bp3-minimal bp3-small bp3-icon-random",
                title: `Random Roam Page (0/${randomRoamPagesList.length})`,
                style: "margin-left: 4px;",
                onclick() { openrandomRoamPage() }
            })

            topbar.appendChild(button)
            console.log(button_id + ' loaded')
        } else {
            // wait for Roam to finish loading
            setTimeout(addButton, 500)
        }
    }

    function openrandomRoamPage() {
        navigateToPage(randomRoamPagesList[roamPageIndex++])

        document.getElementById(button_id).title = `Random Roam Page (${roamPageIndex}/${randomRoamPagesList.length})` // update queue position in tooltip

        if (roamPageIndex == randomRoamPagesList.length) {
            roamPageIndex = 0
            randomRoamPagesList = shuffleArray(userFilteredPagesList())
        }
    }

    function navigateToPage(page_title) {
        window.location.href = `https://roamresearch.com/#/app/${graphName()}/page/${page_title}`
    }

    function graphName() {
        const href_arr = window.location.href.split('/')
        return href_arr[href_arr.indexOf('app') + 1]
    }
})();

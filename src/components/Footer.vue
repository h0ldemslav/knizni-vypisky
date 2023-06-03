<template>
    <footer>
        <div class="section-wrapper">
            <section class="mb-5">
                <h3>O webu</h3>
                <p>
                    <mark>KnižníVýpisky.cz</mark> je webový nástroj, který snadno umožní získat podstatné informace o hledané knížce. 
                    Navíc, je možné si vygenerovat testy za účelem procvičovaní. Tento web je dostupen pro každého, 
                    nicméně pro možnost ukládání svých kolekcí a tvorby testů je nutná registrace, která je zdarma.
                </p>
            </section>

            <section>
                <h3>Kontakty</h3>
                <p>
                    Máte potíže s používáním našeho webu? Pošlete nám zprávu na 
                    <a href="mailto:knizni.vypisky.help@gmail.com" class="default-link">knizni.vypisky.help@gmail.com</a>.
                </p>
            </section>
        </div>
        <hr>
        <p class="copyright-placeholder mt-2">&copy; 2023 KnižníVýpisky.cz</p>
    </footer>
</template>

<style scoped>
    footer {
        margin: 1em;
        margin-top: 2em;
    }

    section h3 {
        margin-bottom: 0.3em;
    }

    section p {
        padding-left: 0.25em;
    }

    .copyright-placeholder {
        text-align: center;
    }

    hr {
        margin-top: 32px;
    }

    mark {
        background-color: rgba(255, 255, 0, 0.0);
        color: red;
    }

    @media screen and (min-width: 960px) {
        .section-wrapper {
            display: flex;
            justify-content: space-around;
        }

        .section-wrapper section {
            flex: 1;
        }

        .section-wrapper section:nth-of-type(2) {
            margin-left: 7.5em;
        }

        .section-wrapper section:nth-of-type(2) p {
            width: 80%;
        }

        hr {
            margin-top: 4em;
        }
    }
</style>
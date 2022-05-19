const vm =  new Vue({
  el:"#app",
  data:{
  objeto:"",
  itemSelec:[],
  carrinho:[],
  displayModal:false
  }, 
  filters:{
    precoFormatado(valor){
    return "R$ " + valor + ",00"
    }
    },
  methods:{

    adicionarCarrinho(event){
      console.log(this.itemSelec)
      if(this.itemSelec.estoque>0){
        this.itemSelec.estoque--
        const{id,nome,preco} = this.itemSelec
        this.carrinho.push({id, nome, preco})
        console.log(this.carrinho)
      }
    },

    api(){
      fetch("./api/produtos.json").then(r=> r.json().then(result => this.objeto = result))
    },

    modal(selec){
      fetch(`./api/produtos/${selec}/dados.json`).then(r=>r.json().then(result => this.itemSelec = result))
      const activeModal = document.querySelector(".modal")
      activeModal.style.display = "inline"
    }, 

    close(event){
      const activeModal = document.querySelector(".modal")
      const closerModal = document.querySelector(".closer")
      if(event.target===activeModal||event.target===closerModal){
        this.itemSelec = ""
        activeModal.style.display = "none"
      }
    },

    removerItem(index){
      this.carrinho.splice(index,1)
      this.itemSelec.estoque++
    }, 

    closeCarrinho(event){
      const carrinho = document.querySelector(".modalCarrinho")
      console.log(event.target)
      if(event.target == carrinho)
        {this.displayModal = !this.displayModal}
    }, 

    armazenamentoLocal(){
      if(window.localStorage.carrinho){
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },

    linkInterno(){
      const LinkHash = document.location.hash;
      if(LinkHash){
        console.log(LinkHash.replace("#",""))
        this.modal(LinkHash.replace("#",""))
      }},

    Estoque(){
      const items = this.carrinho.filter(item=>{
        if(item.id === this.itemSelec.id){
          return true
        }
      })
      this.itemSelec.estoque = this.itemSelec.estoque - items.length
      },

    },


  computed:{
    totalItens(){
      return this.carrinho.length
    },
    carrinhoTotal(){
      let total = 0
      this.carrinho.forEach((i)=>{
        total +=i.preco
      })
      return total
    }
    },
  watch:{
    carrinho(){
      window.localStorage.carrinho = JSON.stringify(this.carrinho)

    },
    itemSelec(){
      const titulo = this.itemSelec? this.itemSelec.nome : "Tecno"
      document.title = titulo
      const hash = this.itemSelec ? this.itemSelec.nome : ""
      history.pushState(null,null, `#${hash}`)
      this.itemSelec? this.Estoque(): ""

    }
  },
  
  created(){
    this.api();
    this.armazenamentoLocal();
    this.linkInterno()
  }
  
})
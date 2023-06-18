class Node {
    constructor() {
        this.child = new Array(97) ;
        this.pref = 0;
        this.end = 0;
        this.links = [] ;
    }

    exist = (ch) => {
        ch = ch.toUpperCase();
        const num = ch.charCodeAt(0)  ;
        return this.child[ num ] !== undefined ;
    }

    push = (ch) => {
        ch = ch.toUpperCase();
        const num = ch.charCodeAt(0) ;
        this.child[ num ] = new Node() ;
    }

    get = (ch) => {
        ch = ch.toUpperCase();
        const num = ch.charCodeAt(0) ;
        return this.child[num] ;
    }
}

class Trie {
    root = new Node() ;

    insertWord = (str , link) => {
        let node = this.root;
        for (let i=0; i<str.length; i++){
            const ch = str[i].toUpperCase() ;
            if (node.exist(ch) ){
                node = node.get(ch) ;
            }
            else {
                node.push(ch) ;
                node = node.get(ch) ;
                node.pref++;
            }
        }
        node.end++;
        node.links.push(link);
    }

    getWordsUtil = (node , ans , arr) => {
        if (node.end>0){
            ans.push({name: arr.join("") , links : node.links}) ;
        }
        
        for (let i=0; i<97; i++){
            const ch = String.fromCharCode(i) ;
            if (node.exist(ch)){
                arr.push(ch) ;
                this.getWordsUtil(node.get(ch) , ans , arr) ;
                arr.pop() ;
            }
        }
    }

    getWords = (str) => {
        if (str.length === 0)
            return [] ;
        const ans = [] ;
        const arr = [] ;
        let node = this.root;

        for (let i=0; i<str.length; i++){
            const ch = str[i].toUpperCase() ;
            if (node.exist(ch)){
                node = node.get(ch) ;
                arr.push(ch) ;
            }
            else {
                return ans;
            }
        }
        
        this.getWordsUtil(node,ans,arr) ;
        return ans;
    }
}

export default Trie;
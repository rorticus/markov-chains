const wordsRegex = /([a-z']+)|([.!?])/igm;

const START_TOKEN = '<start>';
const END_TOKEN  = '<end>';

export interface MarkovChain {
    [key: string]: MarkovChain | number;
}

export function parseTokens(line: string, nGramLength = 1) {
    return [
        ...Array.from(new Array(nGramLength - 1)).map(() => START_TOKEN),
        ...Array.from(line.matchAll(wordsRegex), m => m[0].toLowerCase()).filter(w => w),
        END_TOKEN
        ];
}

export function buildMarkovChain(chain: MarkovChain, tokens: string[], nGramLength = 1) {
    let queue: string[] = [];
    
    tokens.forEach((word) => {
        if(queue.length < nGramLength) {
            queue.push(word);
        }
        else {
            queue.push(word);
            queue.shift();
        }
        
        if(queue.length >= nGramLength) {
            let root = chain;
            
            queue.slice(0, -1).forEach((key) => {
                if(!root[key]) {
                    root[key] = {};
                }
                
                root = root[key] as MarkovChain;
            });
            
            if(!(word in root)) {
                root[word] = 0;
            }

            (root[word] as number)++;
        }
    });
    
    return chain;
}

function pickRandom(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function expandProbabilitiesToArray(obj: { [key: string]: number }) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        return acc.concat(Array(value).fill(key));
    }, [] as string[]);
}

export function generateText(chain: MarkovChain, nGramLength = 1) {
    const words: string[] = Array.from(new Array(nGramLength - 1)).map(() => START_TOKEN);

    while (1) {
        let root = chain;
        
        for (let i = words.length - nGramLength + 1; i < words.length; i++) {
            root = root[words[i]] as MarkovChain;
        }
        
        const w = pickRandom(expandProbabilitiesToArray(root as Record<string, number>));
        if (w === END_TOKEN) {
            break;
        }

        words.push(w);
    }

    let result = words.splice(nGramLength - 1).join(" ");
    result = result.replace(/\s([.?!,])/g, '$1');

    return result;
}
# JLINQ
JLINQ é uma biblioteca JS que simula a funcionalidade do IEnumerator do .NET.
JLINQ extende os métodos de Array com alguns dos métodos presentes na classe Enumerable do .NET.
JLINQ também fornece Lazy Interation, semelhante a yield return.

## Gerando a biblioteca minificada
Para gerar o arquivo de saída foi utilizado o plugin Bundler & Minifier (https://marketplace.visualstudio.com/items?itemName=MadsKristensen.BundlerMinifier).

Após baixar e instalar o plugin, basta ir em Build > Update All Bundles. O arquivo consolidado e minificado estará na pasta dist da aplicação.

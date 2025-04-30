🧠 arquivo: src/controllers/newsController.ts:
#1- export async function updateNews(...) // em vez de alterNews
export async function getNewsById(...) // em vez de getSpecificNews

#2- expressões repetidas (violação do DRY);
validação do id (parseInt(req.params.id) + checagem isNaN || id <= 0)
é repetida em 3 funções (getSpecificNews, alterNews, deleteNews)

#3- as mensagens "Id is not valid." aparecem duras (hardcoded). se isso for usado em mais lugares,
seria ideal extrair para constantes nomeadas (ex: ERROR_INVALID_ID).
(const ERROR_INVALID_ID = "Id is not valid.")

---

🧠 arquivo: src/middlewares/error-handler.ts:
#1- uso excessivo de if...else if para tratar os nomes dos erros. (pode ser simplificado com um Object Lookup)

#2-os nomes dos erros ("NotFound", "Conflict" etc.) e os status estão hardcoded. melhor extrair para constantes nomeadas ou objeto de mapeamento (como feito na refatoração).

#3-èm ambientes reais, usar console.log(error) pode vazar dados sensíveis.

---

🧠 arquivo: src/middlewares/schema-handler.ts:
#1- Magic String, a mensagem de erro está sendo retornada diretamente como string no campo error, sem padronização.

#2- validation.error.message retorna apenas a mensagem concatenada.
ideal é mapear os details do Joi e retornar mensagens específicas

---

🧠 arquivo: src/repositories/news-repository.ts;
#1- getNoticias, getNoticiaById, createNoticia usam nomes em português, mas os tipos e variáveis seguem o padrão em inglês. manter tudo em inglês

#2- new Date(newsData.publicationDate) está duplicada em createNoticia e updateNoticia.
extrair isso para uma função auxiliar, se mais usos forem esperados. pode ser mantido com comentários explicativos se forem os únicos pontos.

---

🧠 arquivo: src/routes/news-routes.ts:
#1- refatoraçao para evitar chamadas como newsController.x, mantendo o código mais limpo e direto

#2- convenção REST para nomes de métodos (getAll, getById, create, update, delete).

---

🧠 arquivo: src/schemas/news-schema.ts:
#1- nome do arquivo é news-schema.ts, mas o import do joi está com joi minúsculo

#2-campo text precisa ter no mínimo 500 caracteres, conforme a regra de negócio original:
"O corpo de uma notícia precisa de no mínimo 500 caracteres (retorna o status 400 Bad Request)"

---

🧠 arquivo: src/services/news-service.ts:
#1- getNews, getSpecificNews, alterNews usam nomes pouco semânticos ou que misturam idiomas

#2- a função é chamada repetidamente apenas para validar existência do ID

#3- a lógica de isNew = true está confusa. Na verdade, essa verificação avalia se o título será alterado, não se é "novo"

---

🧠 arquivo: tests/factories/news-factory.ts:

#1- CreateNewsData foi substituído por NewsData no repositório.

#2- eventData ficou fora de contexto(news e nao event). alterado para newsData

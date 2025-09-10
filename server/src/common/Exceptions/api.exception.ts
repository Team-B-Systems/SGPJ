export default class ApiException extends Error {
    status: number;

    static defaultMessage = (statusCode: number) => {
        switch (statusCode) {
            case 400:
                return "Má Requisição";
            case 401:
                return "Sem Autorização";
            case 403:
                return "Recurso Proibido";
            case 404:
                return "Elemento Não Encontrado";
            case 409:
                return "Conflito de Recurso";
            case 500:
                return "Erro Interno do Servidor";
            case 502:
                return "Bad Gateway";
        }
    }

    constructor(status: number, message?: string) {
        super(message || ApiException.defaultMessage(status));
        this.status = status;

        Object.setPrototypeOf(this, ApiException.prototype);
    }

    toJSON() {
    return {
      statusCode: this.status,
      message: this.message,
    };
  }
}
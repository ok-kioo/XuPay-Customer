import { TcpSocketClient } from "@/infra/client/TcpSocketClient";
import { UdpSocketClient } from "@/infra/client/UdpSocketClient";
import { DNSServiceClient } from "@/modules/health/service/client/DNSServiceClient";
import { ServiceRegistryClient } from "@/modules/customer/service/client/ServiceRegistryClient";

enum CustomerEvents {
    CREATE_CUSTOMER = "/create",
    UPDATE_CUSTOMER = "/update",
    GET_CUSTOMER = "",
    DELETE_CUSTOMER = "/delete"
}

export class CustomerWorker {
  private readonly dnsServiceClient: DNSServiceClient;
  private readonly serviceRegistryClient: ServiceRegistryClient;

  constructor() {
    this.dnsServiceClient = new DNSServiceClient(
      new UdpSocketClient(),
      process.env.DNS_SERVICE_HOST || " ",
      process.env.DNS_SERVICE_PORT || " "
    );

    this.serviceRegistryClient = new ServiceRegistryClient(
      new TcpSocketClient(),
      process.env.SERVICE_REGISTRY_HOST || " ",
      process.env.SERVICE_REGISTRY_PORT || " "
    );
  }

  public async registerService(): Promise<void> {
    try {
      await this.dnsServiceClient.CreateDNS();

      const domain = process.env.XUPAY_SERVICE_DOMAIN || "";

      for (const [key, value] of Object.entries(CustomerEvents)) {
        await this.serviceRegistryClient.send(
            domain,
            key,
            value
        );
      }
    } catch (error) {
        
        console.error("Erro ao registrar o serviço:", error);
    }
  }
  
}
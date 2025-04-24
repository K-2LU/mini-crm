"use client";

import { useState } from "react";
import { ClientList } from "@/components/clients/client-list";
import { ClientDialog } from "@/components/clients/client-dialog";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Add Client
        </Button>
      </div>
      <ClientList />
      <ClientDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}

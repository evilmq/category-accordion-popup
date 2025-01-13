import { useState } from "react";
import { Button } from "@/components/ui/button";
import CategoryPopup from "@/components/CategoryPopup";

const Index = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Button onClick={() => setIsPopupOpen(true)}>
        Открыть категории
      </Button>
      <CategoryPopup 
        open={isPopupOpen} 
        onOpenChange={setIsPopupOpen}
      />
    </div>
  );
};

export default Index;
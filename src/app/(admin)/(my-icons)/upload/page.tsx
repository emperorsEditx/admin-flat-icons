import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Icons - Admin Dashboard What An Icon",
  description: "This is the admin dashboard upload icons page for What An Icon",
};

export default function upload() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Upload Icons" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/3 xl:px-10 xl:py-12">
        <div className="mx-auto w-full text-center">
          <DropzoneComponent/>
        </div>
      </div>
    </div>
  );
}

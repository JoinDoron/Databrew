import { Nav } from "@/components/nav-hero";
import { BrandFooter, PilotPlanner, ProductExperience, Questions, IndustryDemos } from "@/components/home-sections";
import { EnterpriseHero, EnterprisePrinciples, IntegrationPreview, ResourcePreview } from "@/components/enterprise-home";
import { DeploymentExplorer, QuestionDemo } from "@/components/enterprise-interactions";
import { SolutionsCoverage } from "@/components/solution-groups";

export default function Page() {
    return <><a href="#main" className="skip-link">Skip to content</a><Nav /><main id="main"><EnterpriseHero /><QuestionDemo /><ProductExperience /><IntegrationPreview /><SolutionsCoverage /><IndustryDemos /><DeploymentExplorer /><EnterprisePrinciples /><ResourcePreview /><Questions /><PilotPlanner /></main><BrandFooter /></>;
}
